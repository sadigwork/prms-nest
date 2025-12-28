import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification } from '../entities/notification.entity';
import { NotificationTemplate } from '../entities/notification-template.entity';
import { NotificationPreference } from '../entities/notification-preference.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';
import {
  NotificationChannel,
  NotificationType,
} from '../enums/notification.enum';
import { BaseChannel } from './channels/base.channel';
import { EmailChannel } from './channels/email.channel';
import { SmsChannel } from './channels/sms.channel';
import { InAppChannel } from './channels/in-app.channel';
import { PushChannel } from './channels/push.channel';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly channels = new Map<string, BaseChannel>();

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationTemplate)
    private templateRepository: Repository<NotificationTemplate>,
    @InjectRepository(NotificationPreference)
    private preferenceRepository: Repository<NotificationPreference>,
    private eventEmitter: EventEmitter2,
    private emailChannel: EmailChannel,
    private smsChannel: SmsChannel,
    private inAppChannel: InAppChannel,
    private pushChannel: PushChannel,
  ) {
    this.registerChannels();
  }

  private registerChannels(): void {
    this.channels.set(emailChannel.getName(), emailChannel);
    this.channels.set(smsChannel.getName(), smsChannel);
    this.channels.set(inAppChannel.getName(), inAppChannel);
    this.channels.set(pushChannel.getName(), pushChannel);
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    const savedNotification =
      await this.notificationRepository.save(notification);

    // إطلاق حدث إنشاء إشعار جديد
    this.eventEmitter.emit('notification.created', savedNotification);

    return savedNotification;
  }

  async send(sendNotificationDto: SendNotificationDto): Promise<void> {
    const {
      userId,
      type,
      data,
      language = 'ar',
      channels = [],
    } = sendNotificationDto;

    // جلب تفضيلات المستخدم
    const preference = await this.preferenceRepository.findOne({
      where: { userId, type },
    });

    if (!preference || !preference.enabled) {
      this.logger.log(
        `Notifications disabled for user ${userId} and type ${type}`,
      );
      return;
    }

    // جلب القالب
    const template = await this.templateRepository.findOne({
      where: { type, active: true },
    });

    if (!template) {
      this.logger.error(`No template found for type ${type}`);
      return;
    }

    // تحضير القناة (الأولوية: channels المحددة > تفضيلات المستخدم > القناة الافتراضية)
    const channelsToUse =
      channels.length > 0 ? channels : this.getPreferredChannels(preference);

    // إنشاء إشعار لكل قناة
    for (const channel of channelsToUse) {
      const channelInstance = this.channels.get(channel);

      if (
        !channelInstance ||
        !channelInstance.supports(channel as NotificationChannel)
      ) {
        continue;
      }

      // تحضير البيانات
      const notificationData = {
        userId,
        type,
        channel: channel as NotificationChannel,
        title: this.interpolate(template.subject, data, language),
        message: this.interpolate(template.content, data, language),
        data,
        metadata: {
          templateId: template.id,
          language,
          retryCount: 0,
        },
      };

      try {
        // حفظ في قاعدة البيانات
        const notification = await this.create(notificationData as any);

        // إرسال عبر القناة
        await channelInstance.send(notification);

        // تحديث حالة الإرسال
        await this.notificationRepository.update(notification.id, {
          sent: true,
          sentAt: new Date(),
          status: 'SENT',
        });
      } catch (error) {
        this.logger.error(
          `Failed to send notification via ${channel}: ${error.message}`,
        );

        // تحديث حالة الفشل
        await this.notificationRepository.update(notificationData.id, {
          status: 'FAILED',
          error: error.message,
        });
      }
    }
  }

  async sendToMultipleUsers(
    userIds: string[],
    type: NotificationType,
    data: Record<string, any>,
    channels?: NotificationChannel[],
  ): Promise<void> {
    const promises = userIds.map((userId) =>
      this.send({
        userId,
        type,
        data,
        channels,
      } as SendNotificationDto),
    );

    await Promise.allSettled(promises);
  }

  async sendToRole(
    role: string,
    type: NotificationType,
    data: Record<string, any>,
    channels?: NotificationChannel[],
  ): Promise<void> {
    // هذا سيتطلب خدمة المستخدمين للحصول على مستخدمين حسب الدور
    // implementation depends on your user service structure
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters?: any,
  ): Promise<{ data: Notification[]; total: number }> {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (filters?.type) {
      query.andWhere('notification.type = :type', { type: filters.type });
    }

    if (filters?.channel) {
      query.andWhere('notification.channel = :channel', {
        channel: filters.channel,
      });
    }

    if (filters?.read !== undefined) {
      query.andWhere('notification.read = :read', { read: filters.read });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { read: true, readAt: new Date() },
    );

    // تحديث في Redis أيضاً إذا كان إشعار داخل التطبيق
    await this.inAppChannel.markAsRead(userId, notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );
  }

  async updatePreference(
    userId: string,
    type: NotificationType,
    updates: Partial<NotificationPreference>,
  ): Promise<NotificationPreference> {
    let preference = await this.preferenceRepository.findOne({
      where: { userId, type },
    });

    if (!preference) {
      preference = this.preferenceRepository.create({
        userId,
        type,
        ...updates,
      });
    } else {
      Object.assign(preference, updates);
      preference.updatedAt = new Date();
    }

    return await this.preferenceRepository.save(preference);
  }

  private getPreferredChannels(preference: NotificationPreference): string[] {
    const channels = [];

    if (preference.email) channels.push('email');
    if (preference.sms) channels.push('sms');
    if (preference.push) channels.push('push');
    if (preference.inApp) channels.push('in-app');

    return channels;
  }

  private interpolate(
    template: string,
    data: Record<string, any>,
    language: string,
  ): string {
    let result = template;

    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      const translatedValue = this.translateValue(value, language);
      result = result.replace(new RegExp(placeholder, 'g'), translatedValue);
    }

    return result;
  }

  private translateValue(value: any, language: string): string {
    if (typeof value === 'object') {
      // إذا كانت القيمة كائن يحتوي على ترجمات
      return value[language] || value['ar'] || String(value);
    }

    return String(value);
  }

  async scheduleNotification(
    notificationDto: CreateNotificationDto,
    scheduleDate: Date,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...notificationDto,
      scheduledFor: scheduleDate,
      status: 'SCHEDULED',
    });

    return await this.notificationRepository.save(notification);
  }

  async getScheduledNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: {
        status: 'SCHEDULED',
        scheduledFor: new Date(),
      },
    });
  }

  async retryFailedNotifications(): Promise<void> {
    const failedNotifications = await this.notificationRepository.find({
      where: {
        status: 'FAILED',
        sent: false,
      },
      take: 100,
    });

    for (const notification of failedNotifications) {
      if (notification.metadata.retryCount >= 3) {
        continue;
      }

      try {
        const channel = this.channels.get(notification.channel.toLowerCase());
        if (channel) {
          await channel.send(notification);

          await this.notificationRepository.update(notification.id, {
            sent: true,
            sentAt: new Date(),
            status: 'SENT',
          });
        }
      } catch (error) {
        await this.notificationRepository.update(notification.id, {
          metadata: {
            ...notification.metadata,
            retryCount: notification.metadata.retryCount + 1,
          },
        });
      }
    }
  }
}
