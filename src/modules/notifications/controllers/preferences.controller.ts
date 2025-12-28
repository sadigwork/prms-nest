import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { NotificationService } from '../services/notification.service';
import { UpdatePreferenceDto } from '../dto/update-preference.dto';

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user.enum';

import { NotificationPreference } from '../entities/notification-preference.entity';
import { NotificationType } from '../enums/notification.enum';

/**
 * وحدة تحكم تفضيلات الإشعارات
 * Notification Preferences Controller
 *
 * هذا المتحكم مسئول عن:
 * 1. إدارة تفضيلات الإشعارات للمستخدمين
 * 2. تمكين/تعطيل أنواع معينة من الإشعارات
 * 3. تكوين قنوات الإرسال المفضلة
 */
@ApiTags('notification-preferences')
@Controller('notification-preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PreferencesController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'الحصول على تفضيلات الإشعارات',
    description: 'الحصول على جميع تفضيلات الإشعارات للمستخدم الحالي',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع التفضيلات',
    type: [NotificationPreference],
  })
  async getPreferences(@Request() req) {
    const userId = req.user.id;
    const preferences =
      await this.notificationService.getUserPreferences(userId);

    // إذا لم يكن للمستخدم تفضيلات، إنشاء التفضيلات الافتراضية
    // If user has no preferences, create default preferences
    if (!preferences || preferences.length === 0) {
      return this.initializeDefaultPreferences(userId);
    }

    return {
      success: true,
      data: preferences,
      count: preferences.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.REGISTRAR)
  @ApiOperation({
    summary: 'الحصول على تفضيلات مستخدم معين',
    description:
      'الحصول على تفضيلات إشعارات مستخدم معين (للمسؤولين والمسجلين فقط)',
  })
  @ApiParam({
    name: 'userId',
    description: 'معرف المستخدم',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع تفضيلات المستخدم',
    type: [NotificationPreference],
  })
  async getUserPreferences(@Param('userId', ParseUUIDPipe) userId: string) {
    const preferences =
      await this.notificationService.getUserPreferences(userId);

    return {
      success: true,
      data: preferences,
      count: preferences.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('type/:type')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'الحصول على تفضيلات لنوع معين',
    description: 'الحصول على تفضيلات الإشعارات لنوع معين للمستخدم الحالي',
  })
  @ApiParam({
    name: 'type',
    description: 'نوع الإشعار',
    enum: NotificationType,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع التفضيلات',
    type: NotificationPreference,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'التفضيلات غير موجودة',
  })
  async getPreferenceByType(
    @Param('type') type: NotificationType,
    @Request() req,
  ) {
    const userId = req.user.id;
    const preference = await this.notificationService.getPreferenceByType(
      userId,
      type,
    );

    if (!preference) {
      // إنشاء تفضيلات افتراضية إذا لم تكن موجودة
      // Create default preferences if not exist
      return this.notificationService.updatePreference(userId, type, {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      });
    }

    return {
      success: true,
      data: preference,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('initialize')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'تهيئة التفضيلات الافتراضية',
    description: 'تهيئة تفضيلات الإشعارات الافتراضية للمستخدم الحالي',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'تم تهيئة التفضيلات الافتراضية',
  })
  async initializePreferences(@Request() req) {
    const userId = req.user.id;
    const preferences = await this.initializeDefaultPreferences(userId);

    return {
      success: true,
      message: 'تم تهيئة التفضيلات الافتراضية',
      data: preferences,
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':type')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'تحديث تفضيلات نوع معين',
    description: 'تحديث تفضيلات الإشعارات لنوع معين للمستخدم الحالي',
  })
  @ApiParam({
    name: 'type',
    description: 'نوع الإشعار',
    enum: NotificationType,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تحديث التفضيلات',
    type: NotificationPreference,
  })
  async updatePreference(
    @Param('type') type: NotificationType,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    const preference = await this.notificationService.updatePreference(
      userId,
      type,
      updatePreferenceDto,
    );

    return {
      success: true,
      message: 'تم تحديث تفضيلات الإشعارات',
      data: preference,
      timestamp: new Date().toISOString(),
    };
  }

  @Put('bulk-update')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'تحديث مجمع للتفضيلات',
    description: 'تحديث عدة تفضيلات دفعة واحدة',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تحديث جميع التفضيلات',
  })
  async bulkUpdate(
    @Body()
    updates: Array<{
      type: NotificationType;
      preferences: UpdatePreferenceDto;
    }>,
    @Request() req,
  ) {
    const userId = req.user.id;
    const results = [];

    for (const update of updates) {
      const preference = await this.notificationService.updatePreference(
        userId,
        update.type,
        update.preferences,
      );
      results.push(preference);
    }

    return {
      success: true,
      message: 'تم تحديث جميع التفضيلات',
      data: results,
      count: results.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('reset-to-default')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'إعادة تعيين التفضيلات إلى الافتراضي',
    description: 'إعادة تعيين جميع تفضيلات الإشعارات إلى القيم الافتراضية',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم إعادة تعيين التفضيلات',
  })
  async resetToDefault(@Request() req) {
    const userId = req.user.id;

    // حذف جميع التفضيلات الحالية
    // Delete all current preferences
    await this.notificationService.deleteAllUserPreferences(userId);

    // إنشاء التفضيلات الافتراضية
    // Create default preferences
    const preferences = await this.initializeDefaultPreferences(userId);

    return {
      success: true,
      message: 'تم إعادة تعيين التفضيلات إلى الافتراضي',
      data: preferences,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('disable-all')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'تعطيل جميع الإشعارات',
    description: 'تعطيل جميع أنواع الإشعارات للمستخدم الحالي',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تعطيل جميع الإشعارات',
  })
  async disableAll(@Request() req) {
    const userId = req.user.id;

    // الحصول على جميع أنواع الإشعارات
    // Get all notification types
    const notificationTypes = Object.values(NotificationType);

    // تعطيل جميع الأنواع
    // Disable all types
    for (const type of notificationTypes) {
      await this.notificationService.updatePreference(userId, type, {
        enabled: false,
        email: false,
        sms: false,
        push: false,
        inApp: false,
      });
    }

    return {
      success: true,
      message: 'تم تعطيل جميع أنواع الإشعارات',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('enable-all')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'تمكين جميع الإشعارات',
    description: 'تمكين جميع أنواع الإشعارات للمستخدم الحالي',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تمكين جميع الإشعارات',
  })
  async enableAll(@Request() req) {
    const userId = req.user.id;

    // الحصول على جميع أنواع الإشعارات
    // Get all notification types
    const notificationTypes = Object.values(NotificationType);

    // تمكين جميع الأنواع
    // Enable all types
    for (const type of notificationTypes) {
      await this.notificationService.updatePreference(userId, type, {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      });
    }

    return {
      success: true,
      message: 'تم تمكين جميع أنواع الإشعارات',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * تهيئة التفضيلات الافتراضية للمستخدم
   * Initialize default preferences for user
   */
  private async initializeDefaultPreferences(
    userId: string,
  ): Promise<NotificationPreference[]> {
    const notificationTypes = Object.values(NotificationType);
    const defaultPreferences: NotificationPreference[] = [];

    // تفضيلات افتراضية لكل نوع
    // Default preferences for each type
    const defaultSettings = {
      [NotificationType.WELCOME]: {
        enabled: true,
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
      [NotificationType.TITLE_APPLICATION_SUBMITTED]: {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      [NotificationType.TITLE_APPROVED]: {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      [NotificationType.TITLE_REJECTED]: {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      [NotificationType.DOCUMENT_VERIFIED]: {
        enabled: true,
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
      [NotificationType.SYSTEM_ANNOUNCEMENT]: {
        enabled: true,
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
      [NotificationType.NEW_APPLICATION]: {
        enabled: true,
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
      [NotificationType.TITLE_RENEWAL]: {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      [NotificationType.TITLE_EXPIRATION_REMINDER]: {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      [NotificationType.APPLICATION_STATUS_UPDATE]: {
        enabled: true,
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
      [NotificationType.DIRECT_MESSAGE]: {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      [NotificationType.IMPORTANT_NOTICE]: {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      [NotificationType.UPCOMING_EVENT]: {
        enabled: true,
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      [NotificationType.SYSTEM_UPDATE]: {
        enabled: true,
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
    };

    // إنشاء التفضيلات الافتراضية
    // Create default preferences
    for (const type of notificationTypes) {
      const settings = defaultSettings[type] || {
        enabled: true,
        email: true,
        sms: false,
        push: true,
        inApp: true,
      };

      const preference = await this.notificationService.updatePreference(
        userId,
        type,
        settings,
      );

      defaultPreferences.push(preference);
    }

    return defaultPreferences;
  }
}
