import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../../redis/redis.service';
import { Notification } from '../../entities/notification.entity';
import { BaseChannel } from './base.channel';
import { NotificationChannel } from '../../enums/notification.enum';
import { I18nService } from '../../../i18n/i18n.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notifications',
})
export class InAppChannel extends BaseChannel {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(InAppChannel.name);

  constructor(
    private redisService: RedisService,
    private i18nService: I18nService,
  ) {
    super();
  }

  async send(notification: Notification): Promise<boolean> {
    try {
      const language = notification.metadata?.language || 'ar';

      // ترجمة الرسالة
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

      const notificationData = {
        id: notification.id,
        type: notification.type,
        title: translatedTitle,
        message: translatedMessage,
        data: notification.data,
        createdAt: notification.createdAt,
        read: notification.read,
      };

      // حفظ في Redis للاسترجاع لاحقاً
      await this.redisService.setex(
        `notification:${notification.userId}:${notification.id}`,
        86400 * 30, // 30 يوم
        JSON.stringify(notificationData),
      );

      // إرسال عبر WebSocket
      this.server
        .to(`user:${notification.userId}`)
        .emit('notification', notificationData);

      this.logger.log(
        `In-app notification sent to user ${notification.userId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send in-app notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUserNotifications(
    userId: string,
    limit: number = 50,
  ): Promise<any[]> {
    const pattern = `notification:${userId}:*`;
    const keys = await this.redisService.keys(pattern);

    const notifications = [];
    for (const key of keys.slice(0, limit)) {
      const data = await this.redisService.get(key);
      if (data) {
        notifications.push(JSON.parse(data));
      }
    }

    return notifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const key = `notification:${userId}:${notificationId}`;
    const data = await this.redisService.get(key);

    if (data) {
      const notification = JSON.parse(data);
      notification.read = true;
      await this.redisService.setex(
        key,
        86400 * 30,
        JSON.stringify(notification),
      );
    }
  }

  supports(channel: NotificationChannel): boolean {
    return channel === NotificationChannel.IN_APP;
  }

  getName(): string {
    return 'in-app';
  }
}
