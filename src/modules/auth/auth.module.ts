import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../../core/strategies/jwt-refresh.strategy';
import { LocalStrategy } from '../../core/strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { I18nModule } from '../i18n/i18n.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtConfig } from '../../shared/config/configuration';

/**
 * وحدة المصادقة والتفويض
 * Authentication and Authorization Module
 *
 * هذه الوحدة مسئولة عن:
 * 1. تسجيل الدخول والخروج
 * 2. تسجيل المستخدمين الجدد
 * 3. تجديد توكنات الوصول
 * 4. التحقق من هوية المستخدمين
 * 5. إدارة الجلسات
 */
@Module({
  imports: [
    // استيراد وحدة المستخدمين (مع forwardRef لتجنب التبعيات الدائرية)
    // Import Users module (with forwardRef to avoid circular dependencies)
    forwardRef(() => UsersModule),

    // تكوين TypeORM لكيان المستخدم
    // Configure TypeORM for User entity
    TypeOrmModule.forFeature([User]),

    // تكوين Passport للاستراتيجيات المختلفة
    // Configure Passport for different strategies
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false, // لا نستخدم الجلسات، نستخدم JWT
    }),

    // تكوين JWT بشكل غير متزامن لقراءة الإعدادات من البيئة
    // Configure JWT asynchronously to read settings from environment
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtConfig>('jwt');
        return {
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
            issuer: 'professional-registry-system',
            audience: 'users',
          },
        };
      },
      inject: [ConfigService],
    }),

    // استيراد وحدة الترجمة
    // Import I18n module
    I18nModule,

    // استيراد وحدة الإشعارات
    // Import Notifications module
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [
    // خدمات المصادقة
    // Authentication services
    AuthService,

    // استراتيجيات المصادقة
    // Authentication strategies
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
  ],
  exports: [
    // تصدير الخدمات للاستخدام في وحدات أخرى
    // Export services for use in other modules
    AuthService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
