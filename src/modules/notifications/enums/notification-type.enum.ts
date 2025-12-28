/**
 * أنواع الإشعارات في النظام
 * Types of notifications in the system
 *
 * @enum NotificationType
 */
export enum NotificationType {
  /**
   * ترحيب عند التسجيل
   * Welcome upon registration
   */
  WELCOME = 'WELCOME',

  /**
   * طلب لقب مقدم
   * Title application submitted
   */
  TITLE_APPLICATION_SUBMITTED = 'TITLE_APPLICATION_SUBMITTED',

  /**
   * طلب لقب مقبول
   * Title application approved
   */
  TITLE_APPROVED = 'TITLE_APPROVED',

  /**
   * طلب لقب مرفوض
   * Title application rejected
   */
  TITLE_REJECTED = 'TITLE_REJECTED',

  /**
   * مستند تم التحقق منه
   * Document verified
   */
  DOCUMENT_VERIFIED = 'DOCUMENT_VERIFIED',

  /**
   * مستند يحتاج تصحيح
   * Document needs correction
   */
  DOCUMENT_NEEDS_CORRECTION = 'DOCUMENT_NEEDS_CORRECTION',

  /**
   * إعلان نظام
   * System announcement
   */
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',

  /**
   * طلب جديد للمراجعة (للمراجعين)
   * New application for review (for reviewers)
   */
  NEW_APPLICATION = 'NEW_APPLICATION',

  /**
   * تجديد اللقب
   * Title renewal
   */
  TITLE_RENEWAL = 'TITLE_RENEWAL',

  /**
   * اقتراب انتهاء اللقب
   * Title expiration reminder
   */
  TITLE_EXPIRATION_REMINDER = 'TITLE_EXPIRATION_REMINDER',

  /**
   * تحديث في حالة الطلب
   * Application status update
   */
  APPLICATION_STATUS_UPDATE = 'APPLICATION_STATUS_UPDATE',

  /**
   * رسالة مباشرة
   * Direct message
   */
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',

  /**
   * إشعار مهم
   * Important notice
   */
  IMPORTANT_NOTICE = 'IMPORTANT_NOTICE',

  /**
   * حدث قادم
   * Upcoming event
   */
  UPCOMING_EVENT = 'UPCOMING_EVENT',

  /**
   * تحديث النظام
   * System update
   */
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',

  /**
   * تحذير أمني
   * Security alert
   */
  SECURITY_ALERT = 'SECURITY_ALERT',

  /**
   * تأكيد معاملة
   * Transaction confirmation
   */
  TRANSACTION_CONFIRMATION = 'TRANSACTION_CONFIRMATION',

  /**
   * دعوة لفريق أو مجموعة
   * Team or group invitation
   */
  INVITATION = 'INVITATION',

  /**
   * تذكير بموعد
   * Appointment reminder
   */
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',

  /**
   * رد على تعليق أو استفسار
   * Reply to comment or inquiry
   */
  REPLY = 'REPLY',

  /**
   * إشعار بإكمال ملف شخصي
   * Profile completion notification
   */
  PROFILE_COMPLETION = 'PROFILE_COMPLETION',

  /**
   * إشعار بإضافة صديق أو اتصال
   * Friend or connection add notification
   */
  CONNECTION_ADDED = 'CONNECTION_ADDED',

  /**
   * إشعار إحصائي دوري
   * Periodic statistical notification
   */
  STATISTICAL_REPORT = 'STATISTICAL_REPORT',

  /**
   * إشعار بميزة جديدة
   * New feature notification
   */
  NEW_FEATURE = 'NEW_FEATURE',

  /**
   * إشعار بصيانة مجدولة
   * Scheduled maintenance notification
   */
  MAINTENANCE_NOTICE = 'MAINTENANCE_NOTICE',

  /**
   * إشعار بتعليق حساب
   * Account suspension notification
   */
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',

  /**
   * إشعار باستئناف حساب
   * Account reinstatement notification
   */
  ACCOUNT_REINSTATED = 'ACCOUNT_REINSTATED',

  /**
   * إشعار بتغيير سياسة
   * Policy change notification
   */
  POLICY_CHANGE = 'POLICY_CHANGE',

  /**
   * إشعار بفوز بجائزة أو مسابقة
   * Award or contest win notification
   */
  AWARD_WON = 'AWARD_WON',

  /**
   * إشعار بتحديث شهادة
   * Certificate update notification
   */
  CERTIFICATE_UPDATE = 'CERTIFICATE_UPDATE',

  /**
   * إشعار بتجديد عضوية
   * Membership renewal notification
   */
  MEMBERSHIP_RENEWAL = 'MEMBERSHIP_RENEWAL',

  /**
   * إشعار باجتماع قادم
   * Upcoming meeting notification
   */
  MEETING_REMINDER = 'MEETING_REMINDER',

  /**
   * إشعار بدورة تدريبية جديدة
   * New training course notification
   */
  NEW_TRAINING_COURSE = 'NEW_TRAINING_COURSE',

  /**
   * إشعار بندوة أو ورشة عمل
   * Seminar or workshop notification
   */
  SEMINAR_INVITATION = 'SEMINAR_INVITATION',

  /**
   * إشعار بمسح أو استطلاع
   * Survey or poll notification
   */
  SURVEY_INVITATION = 'SURVEY_INVITATION',

  /**
   * إشعار برد استفسار
   * Inquiry response notification
   */
  INQUIRY_RESPONSE = 'INQUIRY_RESPONSE',

  /**
   * إشعار بتقييم أو مراجعة
   * Rating or review notification
   */
  RATING_RECEIVED = 'RATING_RECEIVED',

  /**
   * إشعار بتحديث بيانات
   * Data update notification
   */
  DATA_UPDATED = 'DATA_UPDATED',

  /**
   * إشعار بطلب مساعدة
   * Help request notification
   */
  HELP_REQUEST = 'HELP_REQUEST',

  /**
   * إشعار بطلب دعم
   * Support request notification
   */
  SUPPORT_REQUEST = 'SUPPORT_REQUEST',

  /**
   * إشعار بانتهاء صلاحية
   * Expiry notification
   */
  EXPIRY_NOTICE = 'EXPIRY_NOTICE',

  /**
   * إشعار بإعادة تعيين كلمة مرور
   * Password reset notification
   */
  PASSWORD_RESET = 'PASSWORD_RESET',

  /**
   * إشعار بتغيير كلمة المرور
   * Password change notification
   */
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',

  /**
   * إشعار بتسجيل دخول جديد
   * New login notification
   */
  NEW_LOGIN = 'NEW_LOGIN',

  /**
   * إشعار بتفعيل حساب
   * Account activation notification
   */
  ACCOUNT_ACTIVATED = 'ACCOUNT_ACTIVATED',

  /**
   * إشعار بإلغاء تفعيل حساب
   * Account deactivation notification
   */
  ACCOUNT_DEACTIVATED = 'ACCOUNT_DEACTIVATED',

  /**
   * إشعار بطلب صداقة
   * Friend request notification
   */
  FRIEND_REQUEST = 'FRIEND_REQUEST',

  /**
   * إشعار بقبول صداقة
   * Friend request accepted notification
   */
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',

  /**
   * إشعار برفض صداقة
   * Friend request rejected notification
   */
  FRIEND_REQUEST_REJECTED = 'FRIEND_REQUEST_REJECTED',

  /**
   * إشعار بمشاركة منشور
   * Post share notification
   */
  POST_SHARED = 'POST_SHARED',

  /**
   * إشعار بتعليق على منشور
   * Post comment notification
   */
  POST_COMMENT = 'POST_COMMENT',

  /**
   * إشعار بإعجاب على منشور
   * Post like notification
   */
  POST_LIKE = 'POST_LIKE',

  /**
   * إشعار بإعادة نشر منشور
   * Post repost notification
   */
  POST_REPOST = 'POST_REPOST',

  /**
   * إشعار بذكر في منشور
   * Mention in post notification
   */
  POST_MENTION = 'POST_MENTION',

  /**
   * إشعار بتحديث حالة
   * Status update notification
   */
  STATUS_UPDATE = 'STATUS_UPDATE',

  /**
   * إشعار بتحقيق إنجاز
   * Achievement unlocked notification
   */
  ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',

  /**
   * إشعار بوصول إلى مستوى جديد
   * New level reached notification
   */
  LEVEL_UP = 'LEVEL_UP',

  /**
   * إشعار بتحقيق هدف
   * Goal achieved notification
   */
  GOAL_ACHIEVED = 'GOAL_ACHIEVED',

  /**
   * إشعار بإنذار أو تحذير
   * Warning or alert notification
   */
  WARNING = 'WARNING',

  /**
   * إشعار بخطر أو طوارئ
   * Danger or emergency notification
   */
  EMERGENCY = 'EMERGENCY',

  /**
   * إشعار بفرصة عمل
   * Job opportunity notification
   */
  JOB_OPPORTUNITY = 'JOB_OPPORTUNITY',

  /**
   * إشعار بمقابلة عمل
   * Job interview notification
   */
  JOB_INTERVIEW = 'JOB_INTERVIEW',

  /**
   * إشعار بقبول عرض عمل
   * Job offer acceptance notification
   */
  JOB_OFFER_ACCEPTED = 'JOB_OFFER_ACCEPTED',

  /**
   * إشعار برفض عرض عمل
   * Job offer rejection notification
   */
  JOB_OFFER_REJECTED = 'JOB_OFFER_REJECTED',

  /**
   * إشعار بتحديث ملف تعريفي
   * Profile update notification
   */
  PROFILE_UPDATED = 'PROFILE_UPDATED',

  /**
   * إشعار بتحميل ملف
   * File upload notification
   */
  FILE_UPLOADED = 'FILE_UPLOADED',

  /**
   * إشعار بتنزيل ملف
   * File download notification
   */
  FILE_DOWNLOADED = 'FILE_DOWNLOADED',

  /**
   * إشعار بمشاركة ملف
   * File share notification
   */
  FILE_SHARED = 'FILE_SHARED',

  /**
   * إشعار بتعليق على ملف
   * File comment notification
   */
  FILE_COMMENT = 'FILE_COMMENT',

  /**
   * إشعار بطلب وصول إلى ملف
   * File access request notification
   */
  FILE_ACCESS_REQUEST = 'FILE_ACCESS_REQUEST',

  /**
   * إشعار بمنح وصول إلى ملف
   * File access granted notification
   */
  FILE_ACCESS_GRANTED = 'FILE_ACCESS_GRANTED',

  /**
   * إشعار برفض وصول إلى ملف
   * File access denied notification
   */
  FILE_ACCESS_DENIED = 'FILE_ACCESS_DENIED',

  /**
   * إشعار بإكمال مهمة
   * Task completion notification
   */
  TASK_COMPLETED = 'TASK_COMPLETED',

  /**
   * إشعار بموعد نهائي لمهمة
   * Task deadline notification
   */
  TASK_DEADLINE = 'TASK_DEADLINE',

  /**
   * إشعار بتعيين مهمة
   * Task assignment notification
   */
  TASK_ASSIGNED = 'TASK_ASSIGNED',

  /**
   * إشعار بتحديث مهمة
   * Task update notification
   */
  TASK_UPDATED = 'TASK_UPDATED',

  /**
   * إشعار بإلغاء مهمة
   * Task cancellation notification
   */
  TASK_CANCELLED = 'TASK_CANCELLED',

  /**
   * إشعار بطلب مساعدة في مهمة
   * Task help request notification
   */
  TASK_HELP_REQUEST = 'TASK_HELP_REQUEST',

  /**
   * إشعار بمراجعة مهمة
   * Task review notification
   */
  TASK_REVIEW = 'TASK_REVIEW',

  /**
   * إشعار بتحقيق تقدم في مشروع
   * Project progress notification
   */
  PROJECT_PROGRESS = 'PROJECT_PROGRESS',

  /**
   * إشعار بإكمال مشروع
   * Project completion notification
   */
  PROJECT_COMPLETED = 'PROJECT_COMPLETED',

  /**
   * إشعار بتأخير مشروع
   * Project delay notification
   */
  PROJECT_DELAYED = 'PROJECT_DELAYED',

  /**
   * إشعار ببدء مشروع
   * Project start notification
   */
  PROJECT_STARTED = 'PROJECT_STARTED',

  /**
   * إشعار بإيقاف مشروع
   * Project pause notification
   */
  PROJECT_PAUSED = 'PROJECT_PAUSED',

  /**
   * إشعار باستئناف مشروع
   * Project resumed notification
   */
  PROJECT_RESUMED = 'PROJECT_RESUMED',

  /**
   * إشعار بإلغاء مشروع
   * Project cancellation notification
   */
  PROJECT_CANCELLED = 'PROJECT_CANCELLED',
}

/**
 * خصائص كل نوع إشعار
 * Properties of each notification type
 */
export interface NotificationTypeProperties {
  /** الوصف بالعربية */
  /** Description in Arabic */
  descriptionAr: string;

  /** الوصف بالإنجليزية */
  /** Description in English */
  descriptionEn: string;

  /** الأولوية الافتراضية */
  /** Default priority */
  defaultPriority: string;

  /** القنوات الموصى بها */
  /** Recommended channels */
  recommendedChannels: string[];

  /** هل يتطلب تأكيد استلام؟ */
  /** Requires delivery confirmation? */
  requiresConfirmation: boolean;

  /** وقت الصلاحية (بالأيام) */
  /** Validity period (in days) */
  validityDays: number;

  /** هل يمكن للمستخدم تعطيله؟ */
  /** Can user disable it? */
  userCanDisable: boolean;

  /** فئة الإشعار */
  /** Notification category */
  category: string;

  /** القالب الافتراضي */
  /** Default template */
  defaultTemplate: string;
}

/**
 * خصائص أنواع الإشعارات المختلفة
 * Properties of different notification types
 */
export const NOTIFICATION_TYPE_PROPERTIES: Record<
  NotificationType,
  NotificationTypeProperties
> = {
  [NotificationType.WELCOME]: {
    descriptionAr: 'ترحيب عند التسجيل',
    descriptionEn: 'Welcome upon registration',
    defaultPriority: 'MEDIUM',
    recommendedChannels: ['EMAIL', 'IN_APP'],
    requiresConfirmation: false,
    validityDays: 30,
    userCanDisable: false,
    category: 'SYSTEM',
    defaultTemplate: 'WELCOME_TEMPLATE',
  },
  [NotificationType.TITLE_APPLICATION_SUBMITTED]: {
    descriptionAr: 'طلب لقب مقدم',
    descriptionEn: 'Title application submitted',
    defaultPriority: 'HIGH',
    recommendedChannels: ['EMAIL', 'SMS', 'IN_APP', 'PUSH'],
    requiresConfirmation: true,
    validityDays: 90,
    userCanDisable: false,
    category: 'APPLICATION',
    defaultTemplate: 'TITLE_APPLICATION_SUBMITTED_TEMPLATE',
  },
  [NotificationType.TITLE_APPROVED]: {
    descriptionAr: 'طلب لقب مقبول',
    descriptionEn: 'Title application approved',
    defaultPriority: 'HIGH',
    recommendedChannels: ['EMAIL', 'SMS', 'IN_APP', 'PUSH'],
    requiresConfirmation: true,
    validityDays: 365,
    userCanDisable: false,
    category: 'APPLICATION',
    defaultTemplate: 'TITLE_APPROVED_TEMPLATE',
  },
  // ... باقي الأنواع بنفس الهيكل
  // ... rest of types with same structure
};

/**
 * الحصول على خصائص نوع إشعار محدد
 * Get properties of a specific notification type
 */
export function getNotificationTypeProperties(
  type: NotificationType,
): NotificationTypeProperties {
  return (
    NOTIFICATION_TYPE_PROPERTIES[type] || {
      descriptionAr: 'إشعار عام',
      descriptionEn: 'General notification',
      defaultPriority: 'MEDIUM',
      recommendedChannels: ['EMAIL', 'IN_APP'],
      requiresConfirmation: false,
      validityDays: 30,
      userCanDisable: true,
      category: 'GENERAL',
      defaultTemplate: 'GENERAL_TEMPLATE',
    }
  );
}

/**
 * تصنيف أنواع الإشعارات
 * Classification of notification types
 */
export enum NotificationCategory {
  /** إشعارات النظام */
  /** System notifications */
  SYSTEM = 'SYSTEM',

  /** إشعارات الطلبات */
  /** Application notifications */
  APPLICATION = 'APPLICATION',

  /** إشعارات الأمان */
  /** Security notifications */
  SECURITY = 'SECURITY',

  /** إشعارات التواصل */
  /** Communication notifications */
  COMMUNICATION = 'COMMUNICATION',

  /** إشعارات التسويق */
  /** Marketing notifications */
  MARKETING = 'MARKETING',

  /** إشعارات الإدارة */
  /** Management notifications */
  MANAGEMENT = 'MANAGEMENT',

  /** إشعارات عامة */
  /** General notifications */
  GENERAL = 'GENERAL',
}

/**
 * الحصول على جميع أنواع الإشعارات في فئة معينة
 * Get all notification types in a specific category
 */
export function getNotificationTypesByCategory(
  category: NotificationCategory,
): NotificationType[] {
  const types: NotificationType[] = [];

  for (const [type, properties] of Object.entries(
    NOTIFICATION_TYPE_PROPERTIES,
  )) {
    if (properties.category === category) {
      types.push(type as NotificationType);
    }
  }

  return types;
}

/**
 * التحقق مما إذا كان النوع يتطلب تأكيد استلام
 * Check if type requires delivery confirmation
 */
export function requiresConfirmation(type: NotificationType): boolean {
  const properties = getNotificationTypeProperties(type);
  return properties.requiresConfirmation;
}

/**
 * الحصول على القالب الافتراضي للنوع
 * Get default template for type
 */
export function getDefaultTemplate(type: NotificationType): string {
  const properties = getNotificationTypeProperties(type);
  return properties.defaultTemplate;
}
