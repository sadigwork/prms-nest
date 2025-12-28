/**
 * أنواع الإشعارات
 * Notification types
 */
export enum NotificationType {
  // ترحيبية عند التسجيل
  // Welcome upon registration
  WELCOME = 'WELCOME',

  // طلب لقب مقدم
  // Title application submitted
  TITLE_APPLICATION_SUBMITTED = 'TITLE_APPLICATION_SUBMITTED',

  // طلب لقب مقبول
  // Title application approved
  TITLE_APPROVED = 'TITLE_APPROVED',

  // طلب لقب مرفوض
  // Title application rejected
  TITLE_REJECTED = 'TITLE_REJECTED',

  // مستند تم التحقق منه
  // Document verified
  DOCUMENT_VERIFIED = 'DOCUMENT_VERIFIED',

  // مستند يحتاج تصحيح
  // Document needs correction
  DOCUMENT_NEEDS_CORRECTION = 'DOCUMENT_NEEDS_CORRECTION',

  // إعلان نظام
  // System announcement
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',

  // طلب جديد للمراجعة (للمراجعين)
  // New application for review (for reviewers)
  NEW_APPLICATION = 'NEW_APPLICATION',

  // تجديد اللقب
  // Title renewal
  TITLE_RENEWAL = 'TITLE_RENEWAL',

  // اقتراب انتهاء اللقب
  // Title expiration reminder
  TITLE_EXPIRATION_REMINDER = 'TITLE_EXPIRATION_REMINDER',

  // تحديث في حالة الطلب
  // Application status update
  APPLICATION_STATUS_UPDATE = 'APPLICATION_STATUS_UPDATE',

  // رسالة مباشرة
  // Direct message
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',

  // إشعار مهم
  // Important notice
  IMPORTANT_NOTICE = 'IMPORTANT_NOTICE',

  // حدث قادم
  // Upcoming event
  UPCOMING_EVENT = 'UPCOMING_EVENT',

  // تحديث النظام
  // System update
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
}

/**
 * قنوات الإشعارات
 * Notification channels
 */
export enum NotificationChannel {
  // بريد إلكتروني
  // Email
  EMAIL = 'EMAIL',

  // رسالة نصية (SMS)
  // SMS
  SMS = 'SMS',

  // إشعار داخل التطبيق
  // In-app notification
  IN_APP = 'IN_APP',

  // إشعار Push (للجوال)
  // Push notification (for mobile)
  PUSH = 'PUSH',

  // رسالة واتساب (إذا كان متوفراً)
  // WhatsApp message (if available)
  WHATSAPP = 'WHATSAPP',
}

/**
 * أولوية الإشعار
 * Notification priority
 */
export enum NotificationPriority {
  // عالي - يظهر فوراً
  // High - appears immediately
  HIGH = 'HIGH',

  // متوسط - يظهر خلال فترة قصيرة
  // Medium - appears within a short period
  MEDIUM = 'MEDIUM',

  // منخفض - قد يتأخر ظهوره
  // Low - may be delayed
  LOW = 'LOW',
}

/**
 * حالة الإشعار
 * Notification status
 */
export enum NotificationStatus {
  // قيد الانتظار - لم يتم إرساله بعد
  // Pending - not sent yet
  PENDING = 'PENDING',

  // مجدول - سيتم إرساله في وقت محدد
  // Scheduled - will be sent at a specific time
  SCHEDULED = 'SCHEDULED',

  // مرسل - تم إرساله بنجاح
  // Sent - sent successfully
  SENT = 'SENT',

  // فشل الإرسال
  // Failed to send
  FAILED = 'FAILED',

  // مقروء - رآه المستخدم
  // Read - seen by user
  READ = 'READ',

  // غير مقروء - لم يره المستخدم بعد
  // Unread - not seen by user yet
  UNREAD = 'UNREAD',

  // محذوف - تم حذفه
  // Deleted - deleted
  DELETED = 'DELETED',
}

/**
 * قالب الإشعار
 * Notification template
 */
export enum NotificationTemplate {
  // قالب الترحيب
  // Welcome template
  WELCOME_TEMPLATE = 'WELCOME_TEMPLATE',

  // قالب قبول اللقب
  // Title approval template
  TITLE_APPROVAL_TEMPLATE = 'TITLE_APPROVAL_TEMPLATE',

  // قالب رفض اللقب
  // Title rejection template
  TITLE_REJECTION_TEMPLATE = 'TITLE_REJECTION_TEMPLATE',

  // قالب التحقق من المستند
  // Document verification template
  DOCUMENT_VERIFICATION_TEMPLATE = 'DOCUMENT_VERIFICATION_TEMPLATE',

  // قالب الإعلان العام
  // General announcement template
  GENERAL_ANNOUNCEMENT_TEMPLATE = 'GENERAL_ANNOUNCEMENT_TEMPLATE',

  // قالب تجديد اللقب
  // Title renewal template
  TITLE_RENEWAL_TEMPLATE = 'TITLE_RENEWAL_TEMPLATE',

  // قالب انتهاء صلاحية اللقب
  // Title expiration template
  TITLE_EXPIRATION_TEMPLATE = 'TITLE_EXPIRATION_TEMPLATE',

  // قالب تحديث النظام
  // System update template
  SYSTEM_UPDATE_TEMPLATE = 'SYSTEM_UPDATE_TEMPLATE',
}
