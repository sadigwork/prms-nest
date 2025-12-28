import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { messaging } from 'firebase-admin';

/**
 * مزود خدمة Firebase Cloud Messaging (FCM)
 * Firebase Cloud Messaging (FCM) Service Provider
 *
 * هذا المزود مسئول عن:
 * 1. إدارة اتصال Firebase
 * 2. إرسال الإشعارات الفورية
 * 3. إدارة توكنات الأجهزة
 * 4. إدارة المواضيع
 *
 * This provider is responsible for:
 * 1. Managing Firebase connection
 * 2. Sending push notifications
 * 3. Managing device tokens
 * 4. Managing topics
 */
@Injectable()
export class FirebaseProvider implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FirebaseProvider.name);
  private app: admin.app.App;
  private messaging: messaging.Messaging;
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  /**
   * تهيئة مزود Firebase عند بدء التشغيل
   * Initialize Firebase provider on startup
   */
  async onModuleInit(): Promise<void> {
    await this.initialize();
  }

  /**
   * تنظيف الموارد عند إيقاف التشغيل
   * Cleanup resources on shutdown
   */
  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  /**
   * تهيئة اتصال Firebase
   * Initialize Firebase connection
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        this.logger.log('Firebase provider already initialized');
        return;
      }

      const firebaseConfig = this.configService.get('firebase');

      if (!firebaseConfig) {
        this.logger.warn(
          'Firebase configuration not found, push notifications will be disabled',
        );
        return;
      }

      // التحقق من وجود بيانات الاعتماد
      // Check for credentials
      if (
        !firebaseConfig.projectId ||
        !firebaseConfig.privateKey ||
        !firebaseConfig.clientEmail
      ) {
        this.logger.warn(
          'Firebase credentials incomplete, push notifications will be disabled',
        );
        return;
      }

      // تهيئة تطبيق Firebase
      // Initialize Firebase app
      if (admin.apps.length === 0) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseConfig.projectId,
            privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
            clientEmail: firebaseConfig.clientEmail,
          }),
          databaseURL: firebaseConfig.databaseURL,
        });
      } else {
        this.app = admin.apps[0];
      }

      // الحصول على خدمة المراسلة
      // Get messaging service
      this.messaging = this.app.messaging();

      this.isInitialized = true;
      this.logger.log('Firebase provider initialized successfully');
    } catch (error) {
      this.logger.error(
        `Failed to initialize Firebase provider: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * إرسال إشعار فوري إلى مستخدم
   * Send push notification to a user
   *
   * @param userId معرف المستخدم
   * @param userId User ID
   * @param payload حمولة الإشعار
   * @param payload Notification payload
   * @returns نتيجة الإرسال
   * @returns Send result
   */
  async sendToUser(
    userId: string,
    payload: any,
  ): Promise<{ success: boolean; messageId?: string; deviceCount: number }> {
    try {
      if (!this.isInitialized) {
        this.logger.warn(
          'Firebase provider not initialized, skipping push notification',
        );
        return { success: false, deviceCount: 0 };
      }

      // الحصول على توكنات أجهزة المستخدم
      // Get user's device tokens
      const deviceTokens = await this.getUserDeviceTokens(userId);

      if (deviceTokens.length === 0) {
        this.logger.warn(`No device tokens found for user ${userId}`);
        return { success: false, deviceCount: 0 };
      }

      // إرسال الإشعار إلى جميع أجهزة المستخدم
      // Send notification to all user devices
      const results = await this.sendToDevices(deviceTokens, payload);

      const successCount = results.filter((r) => r.success).length;
      const success = successCount > 0;

      this.logger.log(
        `Sent push notification to ${successCount}/${deviceTokens.length} devices for user ${userId}`,
      );

      return {
        success,
        messageId: success
          ? results.find((r) => r.success)?.messageId
          : undefined,
        deviceCount: deviceTokens.length,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send push notification to user ${userId}: ${error.message}`,
      );
      return { success: false, deviceCount: 0 };
    }
  }

  /**
   * إرسال إشعار فوري إلى أجهزة متعددة
   * Send push notification to multiple devices
   *
   * @param deviceTokens مصفوفة بتوكنات الأجهزة
   * @param deviceTokens Array of device tokens
   * @param payload حمولة الإشعار
   * @param payload Notification payload
   * @returns مصفوفة بنتائج الإرسال
   * @returns Array of send results
   */
  async sendToDevices(
    deviceTokens: string[],
    payload: any,
  ): Promise<
    Array<{
      token: string;
      success: boolean;
      messageId?: string;
      error?: string;
    }>
  > {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase provider not initialized');
      }

      if (deviceTokens.length === 0) {
        return [];
      }

      // إذا كان عدد الأجهزة كبيراً، نقسم إلى مجموعات
      // If device count is large, split into groups
      const MAX_TOKENS_PER_BATCH = 500;
      const batches = [];

      for (let i = 0; i < deviceTokens.length; i += MAX_TOKENS_PER_BATCH) {
        batches.push(deviceTokens.slice(i, i + MAX_TOKENS_PER_BATCH));
      }

      const allResults = [];

      for (const batch of batches) {
        try {
          const message: messaging.MulticastMessage = {
            tokens: batch,
            notification: payload.notification
              ? {
                  title: payload.title,
                  body: payload.body,
                  imageUrl: payload.imageUrl,
                }
              : undefined,
            data: payload.data,
            android: {
              priority: payload.priority === 'high' ? 'high' : 'normal',
              notification: payload.notification
                ? {
                    title: payload.title,
                    body: payload.body,
                    icon: payload.icon,
                    color: payload.color,
                    sound: payload.sound,
                    tag: payload.tag,
                    clickAction: payload.clickAction,
                  }
                : undefined,
            },
            apns: {
              headers: {
                'apns-priority': payload.priority === 'high' ? '10' : '5',
              },
              payload: {
                aps: {
                  alert: payload.notification
                    ? {
                        title: payload.title,
                        body: payload.body,
                      }
                    : undefined,
                  badge: payload.badge ? parseInt(payload.badge) : undefined,
                  sound: payload.sound || 'default',
                  category: payload.category,
                  threadId: payload.threadId,
                },
              },
            },
            webpush: {
              headers: {
                Urgency: payload.priority === 'high' ? 'high' : 'normal',
              },
              notification: payload.notification
                ? {
                    title: payload.title,
                    body: payload.body,
                    icon: payload.icon,
                    badge: payload.badge,
                    vibrate: payload.vibrate,
                    tag: payload.tag,
                    renotify: payload.renotify,
                    requireInteraction: payload.requireInteraction,
                    silent: payload.silent,
                    timestamp: payload.timestamp,
                    actions: payload.actions,
                    data: payload.data,
                  }
                : undefined,
            },
          };

          const response = await this.messaging.sendEachForMulticast(message);

          const batchResults = response.responses.map((resp, index) => ({
            token: batch[index],
            success: resp.success,
            messageId: resp.messageId,
            error: resp.error?.message,
          }));

          allResults.push(...batchResults);

          this.logger.log(
            `Sent batch of ${batch.length} devices, ${response.successCount} succeeded, ${response.failureCount} failed`,
          );
        } catch (error) {
          this.logger.error(`Error sending batch: ${error.message}`);

          // إذا فشلت المجموعة، نضيف جميع الأجهزة كفاشلة
          // If batch fails, add all devices as failed
          const batchResults = batch.map((token) => ({
            token,
            success: false,
            error: error.message,
          }));

          allResults.push(...batchResults);
        }
      }

      return allResults;
    } catch (error) {
      this.logger.error(
        `Failed to send to devices: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * إرسال إشعار فوري إلى موضوع (Topic)
   * Send push notification to a topic
   *
   * @param topic الموضوع
   * @param topic The topic
   * @param payload حمولة الإشعار
   * @param payload Notification payload
   * @returns نتيجة الإرسال
   * @returns Send result
   */
  async sendToTopic(
    topic: string,
    payload: any,
  ): Promise<{ success: boolean; messageId: string }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase provider not initialized');
      }

      const message: messaging.Message = {
        topic,
        notification: payload.notification
          ? {
              title: payload.title,
              body: payload.body,
            }
          : undefined,
        data: payload.data,
      };

      const messageId = await this.messaging.send(message);

      this.logger.log(
        `Sent push notification to topic ${topic}, messageId: ${messageId}`,
      );

      return {
        success: true,
        messageId,
      };
    } catch (error) {
      this.logger.error(`Failed to send to topic ${topic}: ${error.message}`);
      throw error;
    }
  }

  /**
   * الاشتراك في موضوع لأجهزة متعددة
   * Subscribe multiple devices to a topic
   *
   * @param deviceTokens توكنات الأجهزة
   * @param deviceTokens Device tokens
   * @param topic الموضوع
   * @param topic The topic
   * @returns نتيجة الاشتراك
   * @returns Subscription result
   */
  async subscribeToTopic(
    deviceTokens: string[],
    topic: string,
  ): Promise<{ success: boolean; results: any[] }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase provider not initialized');
      }

      if (deviceTokens.length === 0) {
        return { success: true, results: [] };
      }

      const response = await this.messaging.subscribeToTopic(
        deviceTokens,
        topic,
      );

      this.logger.log(
        `Subscribed ${response.successCount} devices to topic ${topic}, ${response.failureCount} failed`,
      );

      const results = deviceTokens.map((token, index) => {
        const error = response.errors[index];
        return {
          token,
          success: !error,
          error: error?.error?.message,
        };
      });

      return {
        success: response.failureCount === 0,
        results,
      };
    } catch (error) {
      this.logger.error(
        `Failed to subscribe to topic ${topic}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * إلغاء الاشتراك من موضوع لأجهزة متعددة
   * Unsubscribe multiple devices from a topic
   *
   * @param deviceTokens توكنات الأجهزة
   * @param deviceTokens Device tokens
   * @param topic الموضوع
   * @param topic The topic
   * @returns نتيجة إلغاء الاشتراك
   * @returns Unsubscription result
   */
  async unsubscribeFromTopic(
    deviceTokens: string[],
    topic: string,
  ): Promise<{ success: boolean; results: any[] }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase provider not initialized');
      }

      if (deviceTokens.length === 0) {
        return { success: true, results: [] };
      }

      const response = await this.messaging.unsubscribeFromTopic(
        deviceTokens,
        topic,
      );

      this.logger.log(
        `Unsubscribed ${response.successCount} devices from topic ${topic}, ${response.failureCount} failed`,
      );

      const results = deviceTokens.map((token, index) => {
        const error = response.errors[index];
        return {
          token,
          success: !error,
          error: error?.error?.message,
        };
      });

      return {
        success: response.failureCount === 0,
        results,
      };
    } catch (error) {
      this.logger.error(
        `Failed to unsubscribe from topic ${topic}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * الحصول على توكنات أجهزة المستخدم
   * Get user's device tokens
   *
   * @param userId معرف المستخدم
   * @param userId User ID
   * @returns مصفوفة بتوكنات الأجهزة
   * @returns Array of device tokens
   */
  private async getUserDeviceTokens(userId: string): Promise<string[]> {
    // في التطبيق الحقيقي، هذا سيأتي من قاعدة البيانات
    // In a real application, this would come from a database
    // هذا مثال مبسط:
    // This is a simplified example:

    // محاكاة قاعدة بيانات لتوكنات الأجهزة
    // Simulating device tokens database
    const mockDeviceTokens: Record<string, string[]> = {
      user1: ['token1', 'token2'],
      user2: ['token3'],
    };

    return mockDeviceTokens[userId] || [];
  }

  /**
   * التحقق من صحة توكن جهاز
   * Validate device token
   *
   * @param token توكن الجهاز
   * @param token Device token
   * @returns true إذا كان التوكن صالحاً
   * @returns true if token is valid
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase provider not initialized');
      }

      // محاولة إرسال رسالة تجريبية
      // Try to send a test message
      const message: messaging.Message = {
        token,
        data: {
          test: 'true',
          timestamp: Date.now().toString(),
        },
      };

      await this.messaging.send(message, true); // dryRun = true
      return true;
    } catch (error) {
      this.logger.warn(`Device token ${token} is invalid: ${error.message}`);
      return false;
    }
  }

  /**
   * الحصول على إحصائيات Firebase
   * Get Firebase statistics
   */
  async getStatistics(): Promise<Record<string, any>> {
    return {
      provider: 'firebase',
      isInitialized: this.isInitialized,
      appName: this.app?.name,
      projectId: this.configService.get('firebase.projectId'),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * إغلاق اتصال Firebase
   * Close Firebase connection
   */
  async close(): Promise<void> {
    try {
      if (this.app) {
        await this.app.delete();
        this.logger.log('Firebase app deleted');
      }

      this.isInitialized = false;
      this.logger.log('Firebase provider closed successfully');
    } catch (error) {
      this.logger.error(`Error closing Firebase provider: ${error.message}`);
    }
  }
}
