import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

import { NotificationsController } from './controllers/notifications.controller';
import { PreferencesController } from './controllers/preferences.controller';
import { NotificationService } from './services/notification.service';
import { TemplateService } from './services/template.service';
import { NotificationListener } from './listeners/notification.listener';

import { Notification } from './entities/notification.entity';
import { NotificationTemplate } from './entities/notification-template.entity';
import { NotificationPreference } from './entities/notification-preference.entity';

// استيراد القنوات
// Import channels
import { EmailChannel } from './services/channels/email.channel';
import { SmsChannel } from './services/channels/sms.channel';
import { InAppChannel } from './services/channels/in-app.channel';
import { PushChannel } from './services/channels/push.channel';

// استيراد مزودي الخدمات
// Import service providers
import { FirebaseProvider } from './providers/firebase.provider';
import { TwilioProvider } from './providers/twilio.provider';
import { SesProvider } from './providers/ses.provider';

import { UsersModule } from '../users/users.module';
import { I18nModule } from '../i18n/i18n.module';
import { RedisModule } from '../../shared/cache/redis.module';

/**
 * وحدة الإشعارات
 * Notifications Module
 *
 * هذه الوحدة مسئولة عن:
 * 1. إرسال الإشعارات عبر قنوات متعددة
 * 2. إدارة قوالب الإشعارات
 * 3. تفضيلات المستخدمين للإشعارات
 * 4. جدولة الإشعارات
 * 5. تتبع حالة الإشعارات
 */
@Module({
  imports: [
    // تكوين TypeORM للكيانات
    // Configure TypeORM for entities
    TypeOrmModule.forFeature([
      Notification,
      NotificationTemplate,
      NotificationPreference,
    ]),

    // استيراد وحدة المستخدمين
    // Import Users module
    forwardRef(() => UsersModule),

    // استيراد وحدة الترجمة
    // Import I18n module
    I18nModule,

    // استيراد وحدة Redis للتخزين المؤقت
    // Import Redis module for caching
    RedisModule,

    // تكوين مصدر الأحداث
    // Configure Event Emitter
    EventEmitterModule.forRoot({
      // تحديد أقصى عدد من المستمعين لكل حدث
      // Set maximum listeners per event
      maxListeners: 10,
      // تجاهل الأخطاء في المستمعين
      // Ignore errors in listeners
      ignoreErrors: false,
      // تمكين الإرسال التفصيلي
      // Enable verbose emission
      verboseMemoryLeak: true,
    }),

    // تكوين الإعدادات
    // Configure settings
    ConfigModule,
  ],
  controllers: [NotificationsController, PreferencesController],
  providers: [
    // الخدمات الرئيسية
    // Main services
    NotificationService,
    TemplateService,

    // المستمعون للأحداث
    // Event listeners
    NotificationListener,

    // قنوات الإشعارات
    // Notification channels
    EmailChannel,
    SmsChannel,
    InAppChannel,
    PushChannel,

    // مزودو الخدمات
    // Service providers
    FirebaseProvider,
    TwilioProvider,
    SesProvider,
  ],
  exports: [
    // تصدير الخدمات الرئيسية للاستخدام في وحدات أخرى
    // Export main services for use in other modules
    NotificationService,
    TemplateService,
    TypeOrmModule,

    // تصدير القنوات للاستخدام المباشر إذا لزم الأمر
    // Export channels for direct use if needed
    EmailChannel,
    SmsChannel,
    InAppChannel,
    PushChannel,
  ],
})
export class NotificationsModule {}
