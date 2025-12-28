import {
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationType,
  NotificationChannel,
} from '../enums/notification.enum';

/**
 * DTO لإرسال إشعار
 * DTO for sending a notification
 */
export class SendNotificationDto {
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

  @ApiPropertyOptional({
    description: 'بيانات الإشعار (يتم دمجها مع القالب)',
    example: { userName: 'أحمد محمد', titleLevel: 'مهندس زراعي' },
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
    description:
      'القنوات المحددة للإرسال (إذا لم تحدد، تستخدم تفضيلات المستخدم)',
    example: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
    enum: NotificationChannel,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels?: NotificationChannel[];

  @ApiPropertyOptional({
    description: 'عنوان مخصص (يتجاوز القالب الافتراضي)',
    example: 'إشعار مهم خاص',
  })
  @IsOptional()
  @IsString()
  customTitle?: string;

  @ApiPropertyOptional({
    description: 'محتوى مخصص (يتجاوز القالب الافتراضي)',
    example: 'هذا إشعار مخصص للمستخدم',
  })
  @IsOptional()
  @IsString()
  customMessage?: string;
}
