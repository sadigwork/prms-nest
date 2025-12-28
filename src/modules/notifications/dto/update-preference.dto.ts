import { IsBoolean, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../enums/notification.enum';

/**
 * DTO لتحديث تفضيلات الإشعارات
 * DTO for updating notification preferences
 */
export class UpdatePreferenceDto {
  @ApiPropertyOptional({
    description: 'تفعيل/تعطيل هذا النوع من الإشعارات',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({
    description: 'تفعيل/تعطيل الإشعارات عبر البريد الإلكتروني',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiPropertyOptional({
    description: 'تفعيل/تعطيل الإشعارات عبر الرسائل النصية (SMS)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sms?: boolean;

  @ApiPropertyOptional({
    description: 'تفعيل/تعطيل الإشعارات عبر الإشعارات الفورية (Push)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @ApiPropertyOptional({
    description: 'تفعيل/تعطيل الإشعارات داخل التطبيق',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  inApp?: boolean;

  @ApiPropertyOptional({
    description: 'إعدادات إضافية حسب النوع',
    example: {
      quietHours: { start: '22:00', end: '08:00' },
      language: 'ar',
      frequency: 'IMMEDIATE',
    },
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

/**
 * DTO لتحديث تفضيلات متعددة دفعة واحدة
 * DTO for updating multiple preferences at once
 */
export class BulkUpdatePreferenceDto {
  @ApiProperty({
    description: 'نوع الإشعار',
    enum: NotificationType,
    example: NotificationType.WELCOME,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'التفضيلات المحدثة',
    type: UpdatePreferenceDto,
  })
  preferences: UpdatePreferenceDto;
}

/**
 * DTO لطلب تعطيل جميع الإشعارات
 * DTO for request to disable all notifications
 */
export class DisableAllNotificationsDto {
  @ApiPropertyOptional({
    description: 'سبب التعطيل (اختياري)',
    example: 'إجازة',
  })
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    description: 'تاريخ إعادة التفعيل التلقائي',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  autoEnableDate?: Date;
}

/**
 * DTO لطلب نسخ التفضيلات من مستخدم آخر
 * DTO for request to copy preferences from another user
 */
export class CopyPreferencesDto {
  @ApiProperty({
    description: 'معرف المستخدم المصدر',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sourceUserId: string;

  @ApiPropertyOptional({
    description: 'أنواع الإشعارات المراد نسخها (إذا لم تحدد، يتم نسخ الكل)',
    example: [NotificationType.WELCOME, NotificationType.TITLE_APPROVED],
    enum: NotificationType,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(NotificationType, { each: true })
  types?: NotificationType[];
}
