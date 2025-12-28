import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { Notification } from '../../entities/notification.entity';
import { BaseChannel } from './base.channel';
import { NotificationChannel } from '../../enums/notification.enum';
import { I18nService } from '../../../i18n/i18n.service';

@Injectable()
export class EmailChannel extends BaseChannel {
  private readonly logger = new Logger(EmailChannel.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private i18nService: I18nService,
  ) {
    super();
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const smtpConfig = this.configService.get('smtp');

    this.transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async send(notification: Notification): Promise<boolean> {
    try {
      const language = notification.metadata?.language || 'ar';

      // ترجمة الموضوع والرسالة
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

      // تجميع قالب HTML
      const html = this.compileTemplate(translatedMessage, notification.data);

      const mailOptions = {
        from: this.configService.get('smtp.from'),
        to: notification.user.email,
        subject: translatedTitle,
        html,
        text: this.stripHtml(translatedMessage),
      };

      await this.transporter.sendMail(mailOptions);

      this.logger.log(`Email sent to ${notification.user.email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  private compileTemplate(content: string, data: Record<string, any>): string {
    const template = handlebars.compile(content);
    return template(data);
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  supports(channel: NotificationChannel): boolean {
    return channel === NotificationChannel.EMAIL;
  }

  getName(): string {
    return 'email';
  }
}
