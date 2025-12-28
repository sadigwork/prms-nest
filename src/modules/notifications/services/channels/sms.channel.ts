import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { Notification } from '../../entities/notification.entity';
import { BaseChannel } from './base.channel';
import { NotificationChannel } from '../../enums/notification.enum';
import { I18nService } from '../../../i18n/i18n.service';

@Injectable()
export class SmsChannel extends BaseChannel {
  private readonly logger = new Logger(SmsChannel.name);
  private twilioClient: Twilio.Twilio;

  constructor(
    private configService: ConfigService,
    private i18nService: I18nService,
  ) {
    super();
    this.initializeTwilio();
  }

  private initializeTwilio(): void {
    const twilioConfig = this.configService.get('twilio');

    this.twilioClient = Twilio(twilioConfig.accountSid, twilioConfig.authToken);
  }

  async send(notification: Notification): Promise<boolean> {
    try {
      const language = notification.metadata?.language || 'ar';

      // ترجمة الرسالة
      const translatedMessage = this.i18nService.translate(
        notification.message,
        language,
        notification.data,
      );

      // اختصار الرسالة إذا كانت طويلة
      const truncatedMessage = this.truncateMessage(translatedMessage);

      await this.twilioClient.messages.create({
        body: truncatedMessage,
        from: this.configService.get('twilio.phoneNumber'),
        to: notification.user.phoneNumber,
      });

      this.logger.log(`SMS sent to ${notification.user.phoneNumber}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`, error.stack);
      throw error;
    }
  }

  private truncateMessage(message: string, maxLength: number = 160): string {
    if (message.length <= maxLength) {
      return message;
    }

    return message.substring(0, maxLength - 3) + '...';
  }

  supports(channel: NotificationChannel): boolean {
    return channel === NotificationChannel.SMS;
  }

  getName(): string {
    return 'sms';
  }
}
