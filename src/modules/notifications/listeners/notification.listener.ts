import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../enums/notification.enum';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private notificationService: NotificationService) {}

  @OnEvent('user.registered')
  async handleUserRegistered(event: any) {
    this.logger.log(`Sending welcome notification to user ${event.userId}`);

    await this.notificationService.send({
      userId: event.userId,
      type: NotificationType.WELCOME,
      data: {
        userName: event.userName,
        email: event.email,
        registrationDate: new Date().toLocaleDateString('ar-SA'),
      },
      language: 'ar',
    });
  }

  @OnEvent('title.application.submitted')
  async handleTitleApplicationSubmitted(event: any) {
    await this.notificationService.send({
      userId: event.userId,
      type: NotificationType.TITLE_APPLICATION_SUBMITTED,
      data: {
        titleLevel: event.titleLevel,
        applicationId: event.applicationId,
        submissionDate: new Date().toLocaleDateString('ar-SA'),
      },
      language: 'ar',
    });

    // إرسال إشعار للمراجعين
    await this.notificationService.sendToRole(
      'REVIEWER',
      NotificationType.NEW_APPLICATION,
      {
        applicantName: event.applicantName,
        titleLevel: event.titleLevel,
        applicationId: event.applicationId,
      },
    );
  }

  @OnEvent('title.approved')
  async handleTitleApproved(event: any) {
    await this.notificationService.send({
      userId: event.userId,
      type: NotificationType.TITLE_APPROVED,
      data: {
        titleLevel: event.titleLevel,
        certificateNumber: event.certificateNumber,
        approvalDate: new Date().toLocaleDateString('ar-SA'),
      },
      language: 'ar',
      channels: ['email', 'sms', 'in-app'], // إرسال عبر جميع القنوات
    });
  }

  @OnEvent('document.verified')
  async handleDocumentVerified(event: any) {
    await this.notificationService.send({
      userId: event.userId,
      type: NotificationType.DOCUMENT_VERIFIED,
      data: {
        documentType: event.documentType,
        verifiedBy: event.verifiedBy,
        verificationDate: new Date().toLocaleDateString('ar-SA'),
      },
      language: 'ar',
    });
  }

  @OnEvent('system.announcement')
  async handleSystemAnnouncement(event: any) {
    if (event.targetUsers) {
      await this.notificationService.sendToMultipleUsers(
        event.targetUsers,
        NotificationType.SYSTEM_ANNOUNCEMENT,
        {
          announcementTitle: event.title,
          announcementMessage: event.message,
          announcementDate: new Date().toLocaleDateString('ar-SA'),
        },
        ['email', 'in-app'],
      );
    } else if (event.targetRole) {
      await this.notificationService.sendToRole(
        event.targetRole,
        NotificationType.SYSTEM_ANNOUNCEMENT,
        {
          announcementTitle: event.title,
          announcementMessage: event.message,
          announcementDate: new Date().toLocaleDateString('ar-SA'),
        },
        ['email', 'in-app'],
      );
    }
  }
}
