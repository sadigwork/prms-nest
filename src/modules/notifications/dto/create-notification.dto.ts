import {
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationType,
  NotificationChannel,
  NotificationPriority,
} from '../enums/notification.enum';

/**
 * DTO لإنشاء إشعار جديد
 * DTO for creating a new notification
 */
export class CreateNotificationDto {
  @ApiProperty({
    description: 'معرف المستخدم الذي سيستلم الإشعار',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'نوع الإشعار',
    example: NotificationType.TITLE_APPROVED,
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'عنوان الإشعار',
    example: 'تمت الموافقة على طلبك',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'محتوى الإشعار',
    example: 'مبروك! تمت الموافقة على طلبك للحصول على لقب مهندس زراعي.',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'قناة الإشعار (اختياري - الافتراضي IN_APP)',
    example: NotificationChannel.IN_APP,
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel = NotificationChannel.IN_APP;

  @ApiPropertyOptional({
    description: 'أولوية الإشعار (اختياري - الافتراضي MEDIUM)',
    example: NotificationPriority.MEDIUM,
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority = NotificationPriority.MEDIUM;

  @ApiPropertyOptional({
    description: 'بيانات إضافية للإشعار',
    example: { titleLevel: 'ENGINEER', certificateNumber: 'ENG-2024-001' },
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'اللغة (اختياري - الافتراضي ar)',
    example: 'ar',
    default: 'ar',
  })
  @IsOptional()
  @IsString()
  language?: string = 'ar';

  @ApiPropertyOptional({
    description: 'تاريخ جدولة الإشعار (إذا كان مستقبلياً)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledFor?: Date;

  @ApiPropertyOptional({
    description: 'بيانات وصفية إضافية',
    example: { templateId: 'TEMPLATE_001', retryCount: 0 },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
