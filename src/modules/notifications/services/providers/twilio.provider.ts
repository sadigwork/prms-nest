import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { SmsProvider, SmsOptions, SmsResult, SmsStatus } from './sms.provider';

/**
 * مزود Twilio للرسائل النصية (SMS)
 * Twilio SMS Service Provider
 * 
 * هذا المزود يستخدم خدمة Twilio لإرسال الرسائل النصية.
 * يدعم إرسال الرسائل الفردية والجماعية، ومتابعة الحالة.
 * 
 * This provider uses Twilio service to send SMS messages.
 * Supports individual and bulk messaging, status tracking.
 */
@Injectable()
export class TwilioProvider implements SmsProvider, OnModuleInit {
  private readonly logger = new Logger(TwilioProvider.name);
  private twilioClient: Twilio.Twilio;
  private fromNumber: string;
  private accountSid: string;
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  /**
   * تهيئة مزود Twilio عند بدء التشغيل
   * Initialize Twilio provider on startup
   */
  async onModuleInit(): Promise<void> {
    await this.initialize();
  }

  /**
   * تهيئة اتصال Twilio
   * Initialize Twilio connection
   */
  async initialize(): Promise<void> {
    try {
      const twilioConfig = this.configService.get('twilio');
      
      if (!twilioConfig) {
        this.logger.warn('Twilio configuration not found, SMS notifications will be disabled');
        return;
      }

      this.accountSid = twilioConfig.accountSid;
      const authToken = twilioConfig.authToken;
      this.fromNumber = twilioConfig.phoneNumber;

      if (!this.accountSid || !authToken || !this.fromNumber) {
        this.logger.warn('Twilio credentials incomplete, SMS notifications will be disabled');
        return;
      }

      // إنشاء عميل Twilio
      // Create Twilio client
      this.twilioClient = Twilio(this.accountSid, authToken);
      
      // التحقق من صحة الاعتماد
      // Validate credentials
      await this.validateCredentials();
      
      this.isInitialized = true;
      this.logger.log('Twilio provider initialized successfully');
      
    } catch (error) {
      this.logger.error(`Failed to initialize Twilio provider: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * التحقق من صحة بيانات اعتماد Twilio
   * Validate Twilio credentials
   */
  private async validateCredentials(): Promise<void> {
    try {
      const account = await this.twilioClient.api.accounts(this.accountSid).fetch();
      
      if (account.status !== 'active') {
        throw new Error(`Twilio account status is ${account.status}`);
      }
      
      this.logger.log(`Twilio account validated: ${account.friendlyName}`);
      
    } catch (error) {
      this.logger.error(`Twilio credentials validation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * إرسال رسالة نصية باستخدام Twilio
   * Send SMS message using Twilio
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
  async send(
    to: string,
    message: string,
    options?: SmsOptions,
  ): Promise<SmsResult> {
    try {
      if (!this.isInitialized) {
        throw new Error('Twilio provider not initialized');
      }

      // التحقق من صحة رقم الهاتف
      // Validate phone number
      if (!this.validatePhoneNumber(to)) {
        throw new Error(`Invalid phone number: ${to}`);
      }

      // إعداد خيارات الرسالة
      // Set up message options
      const twilioOptions: any = {
        from: options?.from || this.fromNumber,
        body: message,
      };

      // إضافة معرف مخصص إذا وجد
      // Add custom ID if exists
      if (options?.customId) {
        twilioOptions.statusCallback = `${this.configService.get('app.url')}/api/sms/callback/${options.customId}`;
      }

      // إضافة معلمات إضافية
      // Add additional parameters
      if (options?.params) {
        Object.assign(twilioOptions, options.params);
      }

      // إرسال الرسالة
      // Send message
      const twilioMessage = await this.twilioClient.messages.create({
        ...twilioOptions,
        to,
      });

      const segments = Math.ceil(message.length / 160);
      const cost = parseFloat(twilioMessage.price || '0');

      const result: SmsResult = {
        success: true,
        messageId: twilioMessage.sid,
        cost,
        segments,
        statusCode: twilioMessage.status,
        statusMessage: this.getStatusMessage(twilioMessage.status),
        to,
        timestamp: new Date(),
        customId: options?.customId,
      };

      this.logger.log(`Twilio SMS sent to ${to}, messageId: ${twilioMessage.sid}, cost: ${cost}, status: ${twilioMessage.status}`);
      
      return result;

    } catch (error) {
      this.logger.error(`Failed to send Twilio SMS to ${to}: ${error.message}`);
      
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

  /**
   * إرسال رسائل نصية جماعية باستخدام Twilio
   * Send bulk SMS messages using Twilio
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
  async sendBulk(
    recipients: string[],
    message: string,
    options?: SmsOptions,
  ): Promise<SmsResult[]> {
    const results: SmsResult[] = [];
    
    // في Twilio، نرسل كل رسالة على حدة
    // In Twilio, we send each message individually
    for (const recipient of recipients) {
      try {
        const result = await this.send(recipient, message, options);
        results.push(result);
        
        // تأخير بسيط بين الرسائل لتجنب Rate Limiting
        // Small delay between messages to avoid Rate Limiting
        await this.delay(100);
        
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
    
    this.logger.log(`Sent ${results.length} Twilio SMS messages, ${results.filter(r => r.success).length} succeeded`);
    
    return results;
  }

  /**
   * الحصول على رصيد حساب Twilio
   * Get Twilio account balance
   * 
   * @returns الرصيد المتاح بالدولار
   * @returns Available balance in USD
   */
  async getBalance(): Promise<number> {
    try {
      if (!this.isInitialized) {
        throw new Error('Twilio provider not initialized');
      }

      const balance = await this.twilioClient.balance.fetch();
      return parseFloat(balance.balance);
      
    } catch (error) {
      this.logger.error(`Failed to get Twilio balance')}
      }: ${error.message}`);
      throw error;
    }   