import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { RolesGuard } from '../../core/guards/roles.guard';
import { NotificationsModule } from '../notifications/notifications.module';
import { I18nModule } from '../i18n/i18n.module';

@Module({
  imports: [
    // تكوين TypeORM لكيان المستخدم
    // Configure TypeORM for User entity
    TypeOrmModule.forFeature([User]),

    // تكوين JWT للمصادقة
    // Configure JWT for authentication
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      inject: [ConfigService],
    }),

    // تكوين Passport للمصادقة
    // Configure Passport for authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // تكوين التخزين المؤقت
    // Configure caching
    CacheModule.register(),

    // استيراد وحدة المصادقة (مع forwardRef لتجنب التبعيات الدائرية)
    // Import Auth module (with forwardRef to avoid circular dependencies)
    forwardRef(() => AuthModule),

    // استيراد وحدة الإشعارات
    // Import Notifications module
    NotificationsModule,

    // استيراد وحدة الترجمة
    // Import I18n module
    I18nModule,
  ],
  controllers: [UsersController],
  providers: [
    // خدمات المستخدمين
    // Users services
    UsersService,

    // استراتيجيات المصادقة
    // Authentication strategies
    JwtStrategy,

    // حراس الصلاحيات
    // Authorization guards
    RolesGuard,
  ],
  exports: [
    // تصدير الخدمات للاستخدام في وحدات أخرى
    // Export services for use in other modules
    UsersService,
    TypeOrmModule,
  ],
})
export class UsersModule {
  constructor() {
    console.log('UsersModule initialized');
  }
}
