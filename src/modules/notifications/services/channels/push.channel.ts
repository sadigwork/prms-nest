import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Notification } from '../../entities/notification.entity';
import { BaseChannel } from './base.channel';
import { NotificationChannel } from '../../enums/notification-channel.enum';
import { I18nService } from '../../../i18n/i18n.service';
import { FirebaseProvider } from '../../providers/firebase.provider';

/**
 * قناة الإشعارات الفورية (Push Notifications)
 * Push Notifications Channel
 *
 * هذه القناة مسئولة عن إرسال الإشعارات الفورية إلى تطبيقات الجوال
 * باستخدام خدمات مثل Firebase Cloud Messaging (FCM).
 *
 * This channel is responsible for sending push notifications to mobile
 * applications using services like Firebase Cloud Messaging (FCM).
 */
@Injectable()
export class PushChannel extends BaseChannel {
  private readonly logger = new Logger(PushChannel.name);
  private isInitialized = false;

  constructor(
    private configService: ConfigService,
    private i18nService: I18nService,
    private firebaseProvider: FirebaseProvider,
  ) {
    super();
  }

  /**
   * تهيئة قناة الإشعارات الفورية
   * Initialize push notifications channel
   */
  async initialize(): Promise<void> {
    try {
      await super.initialize();

      // تهيئة مزود Firebase
      // Initialize Firebase provider
      await this.firebaseProvider.initialize();

      this.isInitialized = true;
      this.logger.log('Push channel initialized successfully');
    } catch (error) {
      this.logger.error(
        `Failed to initialize push channel: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * إرسال إشعار فوري
   * Send push notification
   *
   * @param notification كائن الإشعار المراد إرساله
   * @param notification The notification object to send
   * @returns true إذا نجح الإرسال، false إذا فشل
   * @returns true if sending succeeded, false if failed
   */
  async send(notification: Notification): Promise<boolean> {
    try {
      // التحقق من تهيئة القناة
      // Check channel initialization
      if (!this.isInitialized) {
        await this.initialize();
      }

      // التحقق من صحة الإشعار
      // Validate notification
      this.validateNotification(notification);

      // ترجمة النص إذا لزم الأمر
      // Translate text if needed
      const language = notification.metadata?.language || 'ar';

      const translatedTitle = this.i18nService.translate(
        notification.title,
        language,
        notification.data,
      );

      const translatedMessage = this.i18nService.translate(
        notification.message,
        language,
        notification.data,
      );

      // بناء بيانات الإشعار الفوري
      // Build push notification data
      const pushData = {
        title: translatedTitle,
        body: translatedMessage,
        data: {
          notificationId: notification.id,
          type: notification.type,
          userId: notification.userId,
          ...notification.data,
        },
        priority: this.getFcmPriority(notification.priority),
        badge: this.shouldShowBadge(notification.type) ? '1' : undefined,
        sound: this.getNotificationSound(notification.priority),
        clickAction: this.getClickAction(notification.type),
        icon: this.getNotificationIcon(notification.type),
        color: this.getNotificationColor(notification.priority),
      };

      // إرسال الإشعار الفوري مع إعادة المحاولة
      // Send push notification with retry
      return await this.sendWithRetry(notification, async (notif) => {
        const result = await this.firebaseProvider.sendToUser(
          notif.userId,
          pushData,
        );

        this.logSendResult(notif, result.success, {
          messageId: result.messageId,
          deviceCount: result.deviceCount,
        });

        return result.success;
      });
    } catch (error) {
      this.logger.error(
        `Failed to send push notification: ${error.message}`,
        error.stack,
      );
      this.logSendResult(notification, false, { error: error.message });
      throw error;
    }
  }

  /**
   * الحصول على أولوية FCM المناسبة
   * Get appropriate FCM priority
   *
   * @param priority أولوية الإشعار
   * @param priority Notification priority
   * @returns أولوية FCM
   * @returns FCM priority
   */
  private getFcmPriority(priority: string): string {
    const priorityMap = {
      CRITICAL: 'high',
      HIGH: 'high',
      MEDIUM: 'normal',
      LOW: 'normal',
      INFO: 'normal',
    };

    return priorityMap[priority] || 'normal';
  }

  /**
   * التحقق مما إذا كان يجب عرض Badge للإشعار
   * Check if notification should show badge
   *
   * @param type نوع الإشعار
   * @param type Notification type
   * @returns true إذا كان يجب عرض Badge
   * @returns true if should show badge
   */
  private shouldShowBadge(type: string): boolean {
    const badgeTypes = [
      'TITLE_APPROVED',
      'TITLE_REJECTED',
      'DOCUMENT_VERIFIED',
      'DIRECT_MESSAGE',
      'IMPORTANT_NOTICE',
      'SECURITY_ALERT',
    ];

    return badgeTypes.includes(type);
  }

  /**
   * الحصول على صوت الإشعار المناسب
   * Get appropriate notification sound
   *
   * @param priority أولوية الإشعار
   * @param priority Notification priority
   * @returns اسم الصوت
   * @returns Sound name
   */
  private getNotificationSound(priority: string): string {
    const soundMap = {
      CRITICAL: 'alarm',
      HIGH: 'ringtone',
      MEDIUM: 'notification',
      LOW: 'notification',
      INFO: 'silent',
    };

    return soundMap[priority] || 'notification';
  }

  /**
   * الحصول على إجراء النقر المناسب
   * Get appropriate click action
   *
   * @param type نوع الإشعار
   * @param type Notification type
   * @returns إجراء النقر
   * @returns Click action
   */
  private getClickAction(type: string): string {
    const actionMap = {
      TITLE_APPLICATION_SUBMITTED: 'VIEW_APPLICATION',
      TITLE_APPROVED: 'VIEW_CERTIFICATE',
      TITLE_REJECTED: 'VIEW_APPLICATION',
      DOCUMENT_VERIFIED: 'VIEW_DOCUMENT',
      DIRECT_MESSAGE: 'VIEW_MESSAGE',
      SYSTEM_ANNOUNCEMENT: 'VIEW_ANNOUNCEMENT',
      NEW_APPLICATION: 'REVIEW_APPLICATION',
    };

    return actionMap[type] || 'OPEN_APP';
  }

  /**
   * الحصول على أيقونة الإشعار المناسبة
   * Get appropriate notification icon
   *
   * @param type نوع الإشعار
   * @param type Notification type
   * @returns اسم الأيقونة
   * @returns Icon name
   */
  private getNotificationIcon(type: string): string {
    const iconMap = {
      WELCOME: 'welcome',
      TITLE_APPROVED: 'certificate',
      TITLE_REJECTED: 'warning',
      DOCUMENT_VERIFIED: 'verified',
      SYSTEM_ANNOUNCEMENT: 'announcement',
      DIRECT_MESSAGE: 'message',
      SECURITY_ALERT: 'security',
      UPCOMING_EVENT: 'event',
    };

    return iconMap[type] || 'notification';
  }

  /**
   * الحصول على لون الإشعار المناسب
   * Get appropriate notification color
   *
   * @param priority أولوية الإشعار
   * @param priority Notification priority
   * @returns لون الإشعار
   * @returns Notification color
   */
  private getNotificationColor(priority: string): string {
    const colorMap = {
      CRITICAL: '#ff4444', // أحمر
      HIGH: '#ffbb33', // برتقالي
      MEDIUM: '#33b5e5', // أزرق
      LOW: '#99cc00', // أخضر
      INFO: '#aaaaaa', // رمادي
    };

    return colorMap[priority] || '#33b5e5';
  }

  /**
   * التحقق مما إذا كانت القناة تدعم نوع قناة معين
   * Check if channel supports a specific channel type
   *
   * @param channel نوع القناة
   * @param channel Channel type
   * @returns true إذا كانت القناة تدعم هذا النوع
   * @returns true if channel supports this type
   */
  supports(channel: NotificationChannel): boolean {
    return channel === NotificationChannel.PUSH;
  }

  /**
   * الحصول على اسم القناة
   * Get channel name
   *
   * @returns 'push'
   */
  getName(): string {
    return 'push';
  }

  /**
   * إرسال إشعار فوري إلى أجهزة متعددة
   * Send push notification to multiple devices
   *
   * @param deviceTokens مصفوفة بتوكنات الأجهزة
   * @param deviceTokens Array of device tokens
   * @param payload حمولة الإشعار
   * @param payload Notification payload
   * @returns نتيجة الإرسال
   * @returns Send result
   */
  async sendToDevices(
    deviceTokens: string[],
    payload: any,
  ): Promise<{ success: boolean; results: any[] }> {
    try {
      const results = await this.firebaseProvider.sendToDevices(
        deviceTokens,
        payload,
      );

      this.logger.log(`Sent push notification to ${results.length} devices`);
      return {
        success: results.some((r) => r.success),
        results,
      };
    } catch (error) {
      this.logger.error(`Failed to send to devices: ${error.message}`);
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
      const result = await this.firebaseProvider.sendToTopic(topic, payload);

      this.logger.log(`Sent push notification to topic ${topic}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send to topic ${topic}: ${error.message}`);
      throw error;
    }
  }

  /**
   * الاشتراك في موضوع للأجهزة
   * Subscribe devices to a topic
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
      const results = await this.firebaseProvider.subscribeToTopic(
        deviceTokens,
        topic,
      );

      this.logger.log(
        `Subscribed ${deviceTokens.length} devices to topic ${topic}`,
      );
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to subscribe to topic ${topic}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * إلغاء الاشتراك من موضوع للأجهزة
   * Unsubscribe devices from a topic
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
      const results = await this.firebaseProvider.unsubscribeFromTopic(
        deviceTokens,
        topic,
      );

      this.logger.log(
        `Unsubscribed ${deviceTokens.length} devices from topic ${topic}`,
      );
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to unsubscribe from topic ${topic}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * الحصول على إحصائيات القناة
   * Get channel statistics
   */
  async getStatistics(): Promise<Record<string, any>> {
    const baseStats = await super.getStatistics();
    const firebaseStats = await this.firebaseProvider.getStatistics();

    return {
      ...baseStats,
      ...firebaseStats,
      isInitialized: this.isInitialized,
    };
  }

  /**
   * إغلاق القناة وتنظيف الموارد
   * Close channel and clean up resources
   */
  async close(): Promise<void> {
    await super.close();

    try {
      await this.firebaseProvider.close();
      this.isInitialized = false;
      this.logger.log('Push channel closed successfully');
    } catch (error) {
      this.logger.error(`Error closing push channel: ${error.message}`);
    }
  }
}
