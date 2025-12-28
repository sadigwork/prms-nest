/**
 * أولويات الإشعارات
 * Notification priorities
 *
 * @enum NotificationPriority
 */
export enum NotificationPriority {
  /**
   * أولوية عالية - حرجة
   * High priority - critical
   *
   * يستخدم لـ:
   * - إشعارات الأمان
   * - تأكيدات المعاملات المالية
   * - رسائل التحقق الفورية
   * - إشعارات النظام الحرجة
   *
   * Used for:
   * - Security alerts
   * - Financial transaction confirmations
   * - Instant verification messages
   * - Critical system notifications
   */
  CRITICAL = 'CRITICAL',

  /**
   * أولوية عالية
   * High priority
   *
   * يستخدم لـ:
   * - إشعارات مهمة للمستخدم
   * - تحديثات حالة الطلبات
   * - رسائل التحقق
   * - إشعارات المواعيد النهائية
   *
   * Used for:
   * - Important user notifications
   * - Application status updates
   * - Verification messages
   * - Deadline notifications
   */
  HIGH = 'HIGH',

  /**
   * أولوية متوسطة - افتراضية
   * Medium priority - default
   *
   * يستخدم لـ:
   * - معظم إشعارات التطبيق
   * - تحديثات النظام
   * - الإعلانات
   * - رسائل الترحيب
   *
   * Used for:
   * - Most application notifications
   * - System updates
   * - Announcements
   * - Welcome messages
   */
  MEDIUM = 'MEDIUM',

  /**
   * أولوية منخفضة
   * Low priority
   *
   * يستخدم لـ:
   * - إشعارات المعلومات العامة
   * - النشرات الإخبارية
   * - العروض الترويجية
   * - إشعارات غير عاجلة
   *
   * Used for:
   * - General information notifications
   * - Newsletters
   * - Promotional offers
   * - Non-urgent notifications
   */
  LOW = 'LOW',

  /**
   * أولوية منخفضة جداً - إعلامية فقط
   * Very low priority - informational only
   *
   * يستخدم لـ:
   * - الإحصائيات
   * - التقارير الدورية
   * - معلومات الخلفية
   * - إشعارات لا تتطلب رد فعل
   *
   * Used for:
   * - Statistics
   * - Periodic reports
   * - Background information
   * - Notifications that don't require action
   */
  INFO = 'INFO',
}

/**
 * خصائص كل مستوى أولوية
 * Properties of each priority level
 */
export interface PriorityProperties {
  /** هل يجب إرسال الإشعار فوراً؟ */
  /** Should notification be sent immediately? */
  immediateDelivery: boolean;

  /** عدد مرات إعادة المحاولة عند الفشل */
  /** Number of retry attempts on failure */
  retryAttempts: number;

  /** وقت الانتظار بين محاولات الإرسال (بالثواني) */
  /** Wait time between delivery attempts (in seconds) */
  retryDelay: number;

  /** هل يجب إظهار الإشعار حتى أثناء وضع عدم الإزعاج؟ */
  /** Should notification be shown even during Do Not Disturb mode? */
  bypassDND: boolean;

  /** الصوت الافتراضي للإشعار */
  /** Default notification sound */
  defaultSound: string;

  /** الاهتزاز الافتراضي */
  /** Default vibration pattern */
  defaultVibration: string;

  /** لون الإشعار (للتطبيقات التي تدعم ذلك) */
  /** Notification color (for apps that support it) */
  color?: string;

  /** الأيقونة الافتراضية */
  /** Default icon */
  icon?: string;
}

/**
 * خصائص مستويات الأولوية المختلفة
 * Properties of different priority levels
 */
export const PRIORITY_PROPERTIES: Record<
  NotificationPriority,
  PriorityProperties
> = {
  [NotificationPriority.CRITICAL]: {
    immediateDelivery: true,
    retryAttempts: 5,
    retryDelay: 30, // 30 ثانية
    bypassDND: true,
    defaultSound: 'alarm',
    defaultVibration: 'long',
    color: '#ff4444', // أحمر
    icon: 'warning',
  },
  [NotificationPriority.HIGH]: {
    immediateDelivery: true,
    retryAttempts: 3,
    retryDelay: 60, // 1 دقيقة
    bypassDND: false,
    defaultSound: 'ringtone',
    defaultVibration: 'short',
    color: '#ffbb33', // برتقالي
    icon: 'priority_high',
  },
  [NotificationPriority.MEDIUM]: {
    immediateDelivery: false,
    retryAttempts: 2,
    retryDelay: 300, // 5 دقائق
    bypassDND: false,
    defaultSound: 'notification',
    defaultVibration: 'short',
    color: '#33b5e5', // أزرق
    icon: 'notifications',
  },
  [NotificationPriority.LOW]: {
    immediateDelivery: false,
    retryAttempts: 1,
    retryDelay: 600, // 10 دقائق
    bypassDND: false,
    defaultSound: 'none',
    defaultVibration: 'none',
    color: '#99cc00', // أخضر
    icon: 'info',
  },
  [NotificationPriority.INFO]: {
    immediateDelivery: false,
    retryAttempts: 0,
    retryDelay: 0,
    bypassDND: false,
    defaultSound: 'none',
    defaultVibration: 'none',
    color: '#aaaaaa', // رمادي
    icon: 'remove_red_eye',
  },
};

/**
 * الحصول على خصائص مستوى أولوية محدد
 * Get properties of a specific priority level
 */
export function getPriorityProperties(
  priority: NotificationPriority,
): PriorityProperties {
  return (
    PRIORITY_PROPERTIES[priority] ||
    PRIORITY_PROPERTIES[NotificationPriority.MEDIUM]
  );
}

/**
 * تحويل نص الأولوية إلى كائن PriorityProperties
 * Convert priority text to PriorityProperties object
 */
export function parsePriority(priority: string): NotificationPriority {
  const upperPriority = priority.toUpperCase();

  if (
    Object.values(NotificationPriority).includes(
      upperPriority as NotificationPriority,
    )
  ) {
    return upperPriority as NotificationPriority;
  }

  // التعامل مع أسماء بديلة للأولوية
  // Handle alternative priority names
  const priorityMap: Record<string, NotificationPriority> = {
    URGENT: NotificationPriority.CRITICAL,
    IMPORTANT: NotificationPriority.HIGH,
    NORMAL: NotificationPriority.MEDIUM,
    DEFAULT: NotificationPriority.MEDIUM,
    MINOR: NotificationPriority.LOW,
    TRIVIAL: NotificationPriority.INFO,
  };

  return priorityMap[upperPriority] || NotificationPriority.MEDIUM;
}

/**
 * الحصول على ترتيب الأولويات (من الأعلى إلى الأقل)
 * Get priority order (from highest to lowest)
 */
export const PRIORITY_ORDER: NotificationPriority[] = [
  NotificationPriority.CRITICAL,
  NotificationPriority.HIGH,
  NotificationPriority.MEDIUM,
  NotificationPriority.LOW,
  NotificationPriority.INFO,
];

/**
 * مقارنة أولويتين
 * Compare two priorities
 *
 * @returns
 *   -1 إذا كانت priority1 أعلى من priority2
 *    0 إذا كانتا متساويتين
 *    1 إذا كانت priority1 أقل من priority2
 *
 * @returns
 *   -1 if priority1 is higher than priority2
 *    0 if they are equal
 *    1 if priority1 is lower than priority2
 */
export function comparePriorities(
  priority1: NotificationPriority,
  priority2: NotificationPriority,
): number {
  const index1 = PRIORITY_ORDER.indexOf(priority1);
  const index2 = PRIORITY_ORDER.indexOf(priority2);

  if (index1 < index2) return -1;
  if (index1 > index2) return 1;
  return 0;
}

/**
 * التحقق مما إذا كانت الأولوية الأولى أعلى من الثانية
 * Check if first priority is higher than second
 */
export function isHigherPriority(
  priority1: NotificationPriority,
  priority2: NotificationPriority,
): boolean {
  return comparePriorities(priority1, priority2) < 0;
}

/**
 * الحصول على المستوى المناسب من الأولوية بناءً على نوع الإشعار
 * Get appropriate priority level based on notification type
 */
export function getPriorityForType(
  notificationType: string,
): NotificationPriority {
  const priorityMap: Record<string, NotificationPriority> = {
    // إشعارات أمنية وحرجة
    // Security and critical notifications
    SECURITY_ALERT: NotificationPriority.CRITICAL,
    ACCOUNT_LOCKED: NotificationPriority.CRITICAL,
    SUSPICIOUS_ACTIVITY: NotificationPriority.CRITICAL,

    // إشعارات معاملات مالية
    // Financial transaction notifications
    PAYMENT_CONFIRMED: NotificationPriority.HIGH,
    WITHDRAWAL_REQUEST: NotificationPriority.HIGH,

    // إشعارات التحقق
    // Verification notifications
    VERIFICATION_CODE: NotificationPriority.HIGH,
    TWO_FACTOR_AUTH: NotificationPriority.HIGH,

    // إشعارات حالة الطلبات
    // Application status notifications
    APPLICATION_APPROVED: NotificationPriority.HIGH,
    APPLICATION_REJECTED: NotificationPriority.HIGH,
    APPLICATION_STATUS_UPDATE: NotificationPriority.MEDIUM,

    // إشعارات النظام
    // System notifications
    SYSTEM_UPDATE: NotificationPriority.MEDIUM,
    MAINTENANCE_NOTICE: NotificationPriority.MEDIUM,

    // إشعارات ترحيبية وإعلامية
    // Welcome and informational notifications
    WELCOME: NotificationPriority.MEDIUM,
    NEW_FEATURE: NotificationPriority.MEDIUM,

    // إشعارات ترويجية
    // Promotional notifications
    PROMOTION: NotificationPriority.LOW,
    NEWSLETTER: NotificationPriority.LOW,

    // إشعارات إحصائية
    // Statistical notifications
    WEEKLY_REPORT: NotificationPriority.INFO,
    MONTHLY_STATS: NotificationPriority.INFO,
  };

  return priorityMap[notificationType] || NotificationPriority.MEDIUM;
}

/**
 * الحصول على وصف نصي للأولوية
 * Get textual description of priority
 */
export function getPriorityDescription(priority: NotificationPriority): string {
  const descriptions: Record<NotificationPriority, string> = {
    [NotificationPriority.CRITICAL]: 'حرجة - تتطلب اهتمام فوري',
    [NotificationPriority.HIGH]: 'عالية - مهمة',
    [NotificationPriority.MEDIUM]: 'متوسطة - اعتيادية',
    [NotificationPriority.LOW]: 'منخفضة - إعلامية',
    [NotificationPriority.INFO]: 'معلومات - للاطلاع فقط',
  };

  return descriptions[priority] || 'متوسطة - اعتيادية';
}

/**
 * الحصول على وصف نصي للأولوية باللغة الإنجليزية
 * Get textual description of priority in English
 */
export function getPriorityDescriptionEN(
  priority: NotificationPriority,
): string {
  const descriptions: Record<NotificationPriority, string> = {
    [NotificationPriority.CRITICAL]: 'Critical - requires immediate attention',
    [NotificationPriority.HIGH]: 'High - important',
    [NotificationPriority.MEDIUM]: 'Medium - normal',
    [NotificationPriority.LOW]: 'Low - informational',
    [NotificationPriority.INFO]: 'Info - for your information only',
  };

  return descriptions[priority] || 'Medium - normal';
}
