import { Logger } from '@nestjs/common';
import { Notification } from '../../entities/notification.entity';
import { NotificationChannel } from '../../enums/notification-channel.enum';
import { NotificationPriority } from '../../enums/notification-priority.enum';

/**
 * الفئة الأساسية لقنوات الإشعارات
 * Base class for notification channels
 *
 * هذه الفئة المجردة تحدد الواجهة الأساسية التي يجب أن تطبقها
 * جميع قنوات الإشعارات. توفر وظائف مشتركة مثل التسجيل ومعالجة الأخطاء.
 *
 * This abstract class defines the basic interface that all notification
 * channels must implement. Provides common functions like logging and error handling.
 */
export abstract class BaseChannel {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * إرسال إشعار عبر القناة
   * Send notification through the channel
   *
   * @param notification كائن الإشعار المراد إرساله
   * @param notification The notification object to send
   * @returns وعد يشير إلى نجاح أو فشل عملية الإرسال
   * @returns Promise indicating success or failure of the sending process
   */
  abstract send(notification: Notification): Promise<boolean>;

  /**
   * التحقق مما إذا كانت القناة تدعم نوع قناة معين
   * Check if the channel supports a specific channel type
   *
   * @param channel نوع القناة المراد التحقق منها
   * @param channel The channel type to check
   * @returns true إذا كانت القناة تدعم هذا النوع، false إذا لم تكن
   * @returns true if channel supports this type, false otherwise
   */
  abstract supports(channel: NotificationChannel): boolean;

  /**
   * الحصول على اسم القناة
   * Get channel name
   *
   * @returns اسم القناة الفريد
   * @returns Unique channel name
   */
  abstract getName(): string;

  /**
   * تهيئة القناة (اختياري)
   * Initialize channel (optional)
   *
   * يمكن استخدام هذه الدالة لتهيئة اتصالات أو موارد مطلوبة
   * Can be used to initialize connections or required resources
   */
  async initialize(): Promise<void> {
    this.logger.log(`Initializing ${this.getName()} channel`);
    // التنفيذ الافتراضي لا يفعل شيئاً، يمكن للقنوات تخصيصه
    // Default implementation does nothing, channels can customize it
  }

  /**
   * إغلاق القناة وتنظيف الموارد (اختياري)
   * Close channel and clean up resources (optional)
   */
  async close(): Promise<void> {
    this.logger.log(`Closing ${this.getName()} channel`);
    // التنفيذ الافتراضي لا يفعل شيئاً، يمكن للقنوات تخصيصه
    // Default implementation does nothing, channels can customize it
  }

  /**
   * التحقق من صحة الإشعار قبل الإرسال
   * Validate notification before sending
   *
   * @param notification كائن الإشعار المراد التحقق منه
   * @param notification The notification object to validate
   * @throws خطأ إذا كان الإشعار غير صالح
   * @throws Error if notification is invalid
   */
  protected validateNotification(notification: Notification): void {
    if (!notification) {
      throw new Error('Notification is required');
    }

    if (!notification.userId) {
      throw new Error('Notification user ID is required');
    }

    if (!notification.title || notification.title.trim().length === 0) {
      throw new Error('Notification title is required');
    }

    if (!notification.message || notification.message.trim().length === 0) {
      throw new Error('Notification message is required');
    }

    if (!notification.channel) {
      throw new Error('Notification channel is required');
    }

    // التحقق من أن القناة تدعم هذا النوع
    // Verify that channel supports this type
    if (!this.supports(notification.channel)) {
      throw new Error(
        `Channel ${this.getName()} does not support ${notification.channel}`,
      );
    }
  }

  /**
   * معالجة الإرسال مع إعادة المحاولة
   * Handle sending with retry logic
   *
   * @param notification كائن الإشعار
   * @param notification The notification object
   * @param sendFunction دالة الإرسال الفعلية
   * @param sendFunction The actual send function
   * @returns نتيجة الإرسال
   * @returns Send result
   */
  protected async sendWithRetry(
    notification: Notification,
    sendFunction: (notification: Notification) => Promise<boolean>,
  ): Promise<boolean> {
    const maxRetries = this.getMaxRetries(notification.priority);
    const retryDelay = this.getRetryDelay(notification.priority);

    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(
          `Attempt ${attempt}/${maxRetries} to send notification via ${this.getName()}`,
        );

        const result = await sendFunction(notification);

        if (result) {
          this.logger.log(
            `Notification sent successfully via ${this.getName()} on attempt ${attempt}`,
          );
          return true;
        }

        this.logger.warn(
          `Send function returned false for notification via ${this.getName()}`,
        );
      } catch (error) {
        lastError = error;
        this.logger.error(
          `Error sending notification via ${this.getName()} (attempt ${attempt}): ${error.message}`,
        );

        // إذا لم تكن هذه المحاولة الأخيرة، انتظر ثم أعد المحاولة
        // If this is not the last attempt, wait and retry
        if (attempt < maxRetries) {
          await this.sleep(retryDelay * attempt); // زيادة وقت الانتظار مع كل محاولة
        }
      }
    }

    // إذا وصلنا هنا، فشلت جميع المحاولات
    // If we reach here, all attempts failed
    this.logger.error(
      `Failed to send notification via ${this.getName()} after ${maxRetries} attempts: ${lastError?.message}`,
    );
    throw (
      lastError ||
      new Error(`Failed to send notification via ${this.getName()}`)
    );
  }

  /**
   * الحصول على الحد الأقصى لعدد محاولات الإعادة بناءً على الأولوية
   * Get maximum retry attempts based on priority
   *
   * @param priority أولوية الإشعار
   * @param priority Notification priority
   * @returns عدد المحاولات
   * @returns Number of attempts
   */
  protected getMaxRetries(
    priority: NotificationPriority = NotificationPriority.MEDIUM,
  ): number {
    const retryMap: Record<NotificationPriority, number> = {
      [NotificationPriority.CRITICAL]: 5,
      [NotificationPriority.HIGH]: 3,
      [NotificationPriority.MEDIUM]: 2,
      [NotificationPriority.LOW]: 1,
      [NotificationPriority.INFO]: 0,
    };

    return retryMap[priority] || 2;
  }

  /**
   * الحصول على وقت الانتظار بين المحاولات بناءً على الأولوية
   * Get wait time between retries based on priority
   *
   * @param priority أولوية الإشعار
   * @param priority Notification priority
   * @returns وقت الانتظار بالمللي ثانية
   * @returns Wait time in milliseconds
   */
  protected getRetryDelay(
    priority: NotificationPriority = NotificationPriority.MEDIUM,
  ): number {
    const delayMap: Record<NotificationPriority, number> = {
      [NotificationPriority.CRITICAL]: 5000, // 5 ثواني
      [NotificationPriority.HIGH]: 10000, // 10 ثواني
      [NotificationPriority.MEDIUM]: 30000, // 30 ثانية
      [NotificationPriority.LOW]: 60000, // 1 دقيقة
      [NotificationPriority.INFO]: 120000, // 2 دقيقة
    };

    return delayMap[priority] || 30000;
  }

  /**
   * تأخير التنفيذ لفترة زمنية محددة
   * Delay execution for a specific period
   *
   * @param ms الوقت بالمللي ثانية
   * @param ms Time in milliseconds
   * @returns وعد يتم حله بعد الوقت المحدد
   * @returns Promise that resolves after specified time
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * تسجيل معلومات عن عملية الإرسال
   * Log information about sending process
   *
   * @param notification كائن الإشعار
   * @param notification The notification object
   * @param success حالة النجاح
   * @param success Success status
   * @param additionalInfo معلومات إضافية
   * @param additionalInfo Additional information
   */
  protected logSendResult(
    notification: Notification,
    success: boolean,
    additionalInfo?: Record<string, any>,
  ): void {
    const logData = {
      channel: this.getName(),
      notificationId: notification.id,
      userId: notification.userId,
      type: notification.type,
      priority: notification.priority,
      success,
      timestamp: new Date().toISOString(),
      ...additionalInfo,
    };

    if (success) {
      this.logger.log(`Send result: ${JSON.stringify(logData)}`);
    } else {
      this.logger.error(`Send failed: ${JSON.stringify(logData)}`);
    }
  }

  /**
   * الحصول على إحصائيات القناة
   * Get channel statistics
   *
   * @returns إحصائيات القناة
   * @returns Channel statistics
   */
  async getStatistics(): Promise<Record<string, any>> {
    return {
      channel: this.getName(),
      status: 'ACTIVE',
      supportedChannels: this.getSupportedChannels(),
      initialized: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * الحصول على أنواع القنوات المدعومة
   * Get supported channel types
   *
   * @returns مصفوفة بأنواع القنوات المدعومة
   * @returns Array of supported channel types
   */
  protected getSupportedChannels(): NotificationChannel[] {
    // يجب أن تخصص القنوات الفرعية هذه الدالة
    // Subclasses should override this method
    return [];
  }

  /**
   * التحقق من صحة القناة
   * Validate channel
   *
   * @throws خطأ إذا كانت القناة غير صالحة
   * @throws Error if channel is invalid
   */
  async validate(): Promise<void> {
    // التنفيذ الافتراضي يتحقق فقط من أن القناة مهيأة
    // Default implementation just checks if channel is initialized
    this.logger.log(`Validating ${this.getName()} channel`);
    // يمكن للقنوات تخصيص هذا للتحقق من الاتصالات وغيرها
    // Channels can customize this to check connections, etc.
  }
}
