import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * واجهة مزود خدمة الرسائل النصية (SMS)
 * SMS Service Provider Interface
 *
 * هذه الواجهة تحدد العمليات الأساسية التي يجب أن يدعمها
 * أي مزود لخدمة الرسائل النصية.
 *
 * This interface defines the basic operations that any
 * SMS service provider must support.
 */
export interface SmsProvider {
  /**
   * إرسال رسالة نصية
   * Send SMS message
   *
   * @param to رقم الهاتف المستلم
   * @param to Recipient phone number
   * @param message نص الرسالة
   * @param message Message text
   * @param options خيارات إضافية
   * @param options Additional options
   * @returns نتيجة الإرسال
   * @returns Send result
   */
  send(to: string, message: string, options?: SmsOptions): Promise<SmsResult>;

  /**
   * إرسال رسالة نصية جماعية
   * Send bulk SMS messages
   *
   * @param recipients مصفوفة بأرقام الهواتف
   * @param recipients Array of phone numbers
   * @param message نص الرسالة
   * @param message Message text
   * @param options خيارات إضافية
   * @param options Additional options
   * @returns نتائج الإرسال
   * @returns Send results
   */
  sendBulk(
    recipients: string[],
    message: string,
    options?: SmsOptions,
  ): Promise<SmsResult[]>;

  /**
   * الحصول على رصيد الحساب
   * Get account balance
   *
   * @returns الرصيد المتاح
   * @returns Available balance
   */
  getBalance(): Promise<number>;

  /**
   * الحصول على حالة رسالة
   * Get message status
   *
   * @param messageId معرف الرسالة
   * @param messageId Message ID
   * @returns حالة الرسالة
   * @returns Message status
   */
  getStatus(messageId: string): Promise<SmsStatus>;

  /**
   * التحقق من صحة رقم الهاتف
   * Validate phone number
   *
   * @param phoneNumber رقم الهاتف
   * @param phoneNumber Phone number
   * @returns true إذا كان الرقم صالحاً
   * @returns true if number is valid
   */
  validatePhoneNumber(phoneNumber: string): boolean;
}

/**
 * خيارات إرسال الرسائل النصية
 * SMS sending options
 */
export interface SmsOptions {
  /** المرسل (اختياري) */
  /** Sender (optional) */
  from?: string;

  /** معرف خاص بالعملية (اختياري) */
  /** Custom ID for tracking (optional) */
  customId?: string;

  /** جدولة الإرسال (اختياري) */
  /** Schedule sending (optional) */
  schedule?: Date;

  /** هل هي رسالة تسويقية؟ */
  /** Is it a marketing message? */
  isPromotional?: boolean;

  /** هل هي رسالة عاجلة؟ */
  /** Is it an urgent message? */
  isUrgent?: boolean;

  /** معلمات إضافية حسب المزود */
  /** Additional provider-specific parameters */
  params?: Record<string, any>;
}

/**
 * نتيجة إرسال الرسالة النصية
 * SMS sending result
 */
export interface SmsResult {
  /** نجاح العملية */
  /** Success status */
  success: boolean;

  /** معرف الرسالة */
  /** Message ID */
  messageId?: string;

  /** تكلفة الرسالة */
  /** Message cost */
  cost?: number;

  /** عدد المقاطع */
  /** Number of segments */
  segments?: number;

  /** رمز الحالة */
  /** Status code */
  statusCode?: string;

  /** رسالة الحالة */
  /** Status message */
  statusMessage?: string;

  /** رقم الهاتف المستلم */
  /** Recipient phone number */
  to: string;

  /** الطابع الزمني */
  /** Timestamp */
  timestamp: Date;

  /** معرف مخصص للتبعية */
  /** Custom ID for tracking */
  customId?: string;
}

/**
 * حالة الرسالة النصية
 * SMS message status
 */
export interface SmsStatus {
  /** معرف الرسالة */
  /** Message ID */
  messageId: string;

  /** حالة التسليم */
  /** Delivery status */
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'PENDING' | 'UNKNOWN';

  /** وقت الإرسال */
  /** Send time */
  sentAt?: Date;

  /** وقت التسليم */
  /** Delivery time */
  deliveredAt?: Date;

  /** رمز الحالة */
  /** Status code */
  statusCode?: string;

  /** رسالة الحالة */
  /** Status message */
  statusMessage?: string;

  /** تكلفة الرسالة */
  /** Message cost */
  cost?: number;
}

/**
 * مزود SMS افتراضي للمحاكاة
 * Default SMS provider for simulation
 *
 * يستخدم في بيئة التطوير للاختبار بدون تكاليف
 * Used in development environment for testing without costs
 */
@Injectable()
export class MockSmsProvider implements SmsProvider {
  private readonly logger = new Logger(MockSmsProvider.name);
  private messageStore: Map<string, SmsResult> = new Map();

  constructor(private configService: ConfigService) {}

  async send(
    to: string,
    message: string,
    options?: SmsOptions,
  ): Promise<SmsResult> {
    try {
      // التحقق من صحة رقم الهاتف
      // Validate phone number
      if (!this.validatePhoneNumber(to)) {
        throw new Error(`Invalid phone number: ${to}`);
      }

      // التحقق من طول الرسالة
      // Check message length
      if (message.length > 160) {
        this.logger.warn(
          `Message length ${message.length} exceeds 160 characters, it will be truncated`,
        );
      }

      // محاكاة التأخير في الشبكة
      // Simulate network delay
      await this.simulateNetworkDelay();

      const messageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const segments = Math.ceil(message.length / 160);
      const cost = this.calculateCost(segments, options?.isPromotional);

      const result: SmsResult = {
        success: true,
        messageId,
        cost,
        segments,
        statusCode: '100',
        statusMessage: 'Message sent successfully',
        to,
        timestamp: new Date(),
        customId: options?.customId,
      };

      // تخزين الرسالة للمتابعة
      // Store message for tracking
      this.messageStore.set(messageId, result);

      this.logger.log(
        `Mock SMS sent to ${to}, messageId: ${messageId}, cost: ${cost}, segments: ${segments}`,
      );

      // محاكاة تحديث حالة التسليم بعد تأخير
      // Simulate delivery status update after delay
      this.simulateDeliveryStatus(messageId);

      return result;
    } catch (error) {
      this.logger.error(`Failed to send mock SMS to ${to}: ${error.message}`);

      return {
        success: false,
        statusCode: '500',
        statusMessage: error.message,
        to,
        timestamp: new Date(),
        customId: options?.customId,
      };
    }
  }

  async sendBulk(
    recipients: string[],
    message: string,
    options?: SmsOptions,
  ): Promise<SmsResult[]> {
    const results: SmsResult[] = [];

    for (const recipient of recipients) {
      try {
        const result = await this.send(recipient, message, options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          statusCode: '500',
          statusMessage: error.message,
          to: recipient,
          timestamp: new Date(),
          customId: options?.customId,
        });
      }
    }

    this.logger.log(
      `Sent ${results.length} mock SMS messages, ${results.filter((r) => r.success).length} succeeded`,
    );

    return results;
  }

  async getBalance(): Promise<number> {
    // محاكاة رصيد غير محدود في بيئة المحاكاة
    // Simulate unlimited balance in mock environment
    return 1000;
  }

  async getStatus(messageId: string): Promise<SmsStatus> {
    const message = this.messageStore.get(messageId);

    if (!message) {
      return {
        messageId,
        status: 'UNKNOWN',
        statusMessage: 'Message not found',
      };
    }

    // محاكاة حالات عشوائية
    // Simulate random statuses
    const statuses: Array<'SENT' | 'DELIVERED' | 'FAILED' | 'PENDING'> = [
      'SENT',
      'DELIVERED',
      'FAILED',
      'PENDING',
    ];

    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const sentAt = message.timestamp;
    const deliveredAt =
      randomStatus === 'DELIVERED'
        ? new Date(sentAt.getTime() + Math.random() * 60000) // خلال دقيقة
        : undefined;

    return {
      messageId,
      status: randomStatus,
      sentAt,
      deliveredAt,
      statusCode: '200',
      statusMessage: `Message ${randomStatus.toLowerCase()}`,
      cost: message.cost,
    };
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    // تحقق مبسط من رقم الهاتف
    // Simple phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * محاكاة تأخير الشبكة
   * Simulate network delay
   */
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * حساب تكلفة الرسالة
   * Calculate message cost
   */
  private calculateCost(segments: number, isPromotional?: boolean): number {
    const baseCost = isPromotional ? 0.02 : 0.05; // دولار
    return parseFloat((baseCost * segments).toFixed(4));
  }

  /**
   * محاكاة تحديث حالة التسليم
   * Simulate delivery status update
   */
  private async simulateDeliveryStatus(messageId: string): Promise<void> {
    setTimeout(
      async () => {
        const message = this.messageStore.get(messageId);
        if (message) {
          // تحديث حالة 80% من الرسائل إلى "تم التسليم"
          // Update 80% of messages to "DELIVERED"
          if (Math.random() < 0.8) {
            const deliveredResult = {
              ...message,
              statusCode: '200',
              statusMessage: 'Message delivered',
            };
            this.messageStore.set(messageId, deliveredResult);
            this.logger.log(`Mock SMS ${messageId} delivered`);
          }
        }
      },
      Math.random() * 10000 + 5000,
    ); // 5-15 ثانية
  }

  /**
   * الحصول على إحصائيات المزود
   * Get provider statistics
   */
  getStatistics(): Record<string, any> {
    const totalMessages = this.messageStore.size;
    const successfulMessages = Array.from(this.messageStore.values()).filter(
      (m) => m.success,
    ).length;

    return {
      provider: 'mock',
      totalMessages,
      successfulMessages,
      successRate:
        totalMessages > 0 ? (successfulMessages / totalMessages) * 100 : 0,
      estimatedCost: Array.from(this.messageStore.values()).reduce(
        (sum, m) => sum + (m.cost || 0),
        0,
      ),
      timestamp: new Date().toISOString(),
    };
  }
}
