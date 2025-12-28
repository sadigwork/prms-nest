import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { NotificationService } from '../services/notification.service';
import { TemplateService } from '../services/template.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { PaginationDto } from '../../../core/common/dto/pagination.dto';

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user.enum';
import { Public } from '../../../core/decorators/public.decorator';

import { Notification } from '../entities/notification.entity';
import {
  NotificationType,
  NotificationStatus,
} from '../enums/notification.enum';

/**
 * وحدة تحكم الإشعارات
 * Notifications Controller
 *
 * هذا المتحكم مسئول عن:
 * 1. إدارة الإشعارات
 * 2. إرسال الإشعارات
 * 3. استرجاع الإشعارات
 * 4. تحديث حالة الإشعارات
 */
@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly templateService: TemplateService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.REGISTRAR)
  @ApiOperation({
    summary: 'إنشاء إشعار جديد',
    description: 'إنشاء إشعار جديد وإرساله للمستخدم',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'تم إنشاء الإشعار بنجاح',
    type: Notification,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'بيانات غير صالحة',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'غير مصرح',
  })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Post('send')
  @Roles(UserRole.ADMIN, UserRole.REGISTRAR)
  @ApiOperation({
    summary: 'إرسال إشعار',
    description: 'إرسال إشعار باستخدام القالب المناسب',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم إرسال الإشعار بنجاح',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'بيانات غير صالحة',
  })
  async send(@Body() sendNotificationDto: SendNotificationDto) {
    await this.notificationService.send(sendNotificationDto);
    return {
      success: true,
      message: 'تم إرسال الإشعار بنجاح',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'الحصول على جميع الإشعارات',
    description: 'الحصول على جميع الإشعارات مع التقسيم',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'رقم الصفحة',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'عدد العناصر في الصفحة',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: NotificationType,
    description: 'فلترة حسب النوع',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: NotificationStatus,
    description: 'فلترة حسب الحالة',
  })
  @ApiQuery({
    name: 'read',
    required: false,
    type: Boolean,
    description: 'فلترة حسب حالة القراءة',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع الإشعارات بنجاح',
  })
  async findAll(
    @Request() req,
    @Query() paginationDto: PaginationDto,
    @Query('type') type?: NotificationType,
    @Query('status') status?: NotificationStatus,
    @Query('read') read?: boolean,
  ) {
    const userId = req.user.id;
    const filters: any = {};

    if (type) filters.type = type;
    if (status) filters.status = status;
    if (read !== undefined) filters.read = read === true;

    // للمسؤولين، يمكنهم رؤية جميع الإشعارات
    // For admins, they can see all notifications
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role !== UserRole.REGISTRAR
    ) {
      // للمستخدمين العاديين، يرون فقط إشعاراتهم
      // For regular users, they only see their own notifications
      return this.notificationService.getUserNotifications(
        userId,
        paginationDto.page,
        paginationDto.limit,
        filters,
      );
    }

    // للمسؤولين، الحصول على جميع الإشعارات
    // For admins, get all notifications
    return this.notificationService.getAllNotifications(paginationDto, filters);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.REGISTRAR)
  @ApiOperation({
    summary: 'الحصول على إشعارات مستخدم معين',
    description: 'الحصول على إشعارات مستخدم معين (للمسؤولين والمسجلين فقط)',
  })
  @ApiParam({
    name: 'userId',
    description: 'معرف المستخدم',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع إشعارات المستخدم',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'المستخدم غير موجود',
  })
  async getUserNotifications(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.notificationService.getUserNotifications(
      userId,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get('unread')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'الحصول على الإشعارات غير المقروءة',
    description: 'الحصول على الإشعارات غير المقروءة للمستخدم الحالي',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع الإشعارات غير المقروءة',
  })
  async getUnreadNotifications(@Request() req) {
    const userId = req.user.id;
    const { data: notifications } =
      await this.notificationService.getUserNotifications(userId, 1, 50, {
        read: false,
      });

    return {
      success: true,
      data: notifications,
      count: notifications.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'الحصول على إشعار محدد',
    description: 'الحصول على إشعار محدد بواسطة المعرف',
  })
  @ApiParam({
    name: 'id',
    description: 'معرف الإشعار',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع الإشعار',
    type: Notification,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'الإشعار غير موجود',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const notification = await this.notificationService.getNotificationById(id);

    // التحقق من صلاحية الوصول
    // Check access permission
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role !== UserRole.REGISTRAR &&
      notification.userId !== req.user.id
    ) {
      throw new Error('غير مصرح لك بالوصول إلى هذا الإشعار');
    }

    return notification;
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'تعليم إشعار كمقروء',
    description: 'تعليم إشعار محدد كمقروء',
  })
  @ApiParam({
    name: 'id',
    description: 'معرف الإشعار',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تعليم الإشعار كمقروء',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'الإشعار غير موجود',
  })
  async markAsRead(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user.id;
    await this.notificationService.markAsRead(userId, id);

    return {
      success: true,
      message: 'تم تعليم الإشعار كمقروء',
      timestamp: new Date().toISOString(),
    };
  }

  @Patch('mark-all-read')
  @HttpCode(HttpStatus.OK)
  @Roles(
    UserRole.ADMIN,
    UserRole.REGISTRAR,
    UserRole.APPLICANT,
    UserRole.ENGINEER,
    UserRole.TECHNICIAN,
  )
  @ApiOperation({
    summary: 'تعليم جميع الإشعارات كمقروءة',
    description: 'تعليم جميع الإشعارات غير المقروءة للمستخدم الحالي كمقروءة',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم تعليم جميع الإشعارات كمقروءة',
  })
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    await this.notificationService.markAllAsRead(userId);

    return {
      success: true,
      message: 'تم تعليم جميع الإشعارات كمقروءة',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.REGISTRAR)
  @ApiOperation({
    summary: 'حذف إشعار',
    description: 'حذف إشعار محدد (للمسؤولين والمسجلين فقط)',
  })
  @ApiParam({
    name: 'id',
    description: 'معرف الإشعار',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم حذف الإشعار',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'الإشعار غير موجود',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.notificationService.deleteNotification(id);

    return {
      success: true,
      message: 'تم حذف الإشعار',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('broadcast')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'بث إشعار جماعي',
    description: 'بث إشعار لجميع المستخدمين أو مجموعة معينة',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم بدء عملية البث',
  })
  async broadcast(
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('type') type: NotificationType = NotificationType.SYSTEM_ANNOUNCEMENT,
    @Body('targetRoles') targetRoles?: UserRole[],
    @Body('targetUserIds') targetUserIds?: string[],
  ) {
    // إطلاق حدث البث
    // Emit broadcast event
    this.eventEmitter.emit('notification.broadcast', {
      title,
      message,
      type,
      targetRoles,
      targetUserIds,
      timestamp: new Date(),
    });

    return {
      success: true,
      message: 'تم بدء عملية بث الإشعار',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.REGISTRAR)
  @ApiOperation({
    summary: 'إحصائيات الإشعارات',
    description: 'الحصول على إحصائيات عن الإشعارات',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم استرجاع الإحصائيات',
  })
  async getStats() {
    const stats = await this.notificationService.getNotificationStats();

    return {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'فحص صحة نظام الإشعارات',
    description: 'فحص حالة نظام الإشعارات وقنوات الإرسال',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'نظام الإشعارات يعمل بشكل صحيح',
  })
  async healthCheck() {
    const health = await this.notificationService.checkHealth();

    return {
      success: true,
      data: health,
      timestamp: new Date().toISOString(),
    };
  }
}
