/**
 * قنوات الإشعارات المتاحة في النظام
 * Available notification channels in the system
 *
 * @enum NotificationChannel
 */
export enum NotificationChannel {
  /**
   * البريد الإلكتروني
   * Email notifications
   *
   * مميزاته:
   * - مناسب للرسائل الطويلة
   * - يمكن إرفاق ملفات
   * - سجل مرجعي
   *
   * Features:
   * - Suitable for long messages
   * - Can attach files
   * - Reference record
   */
  EMAIL = 'EMAIL',

  /**
   * الرسائل النصية (SMS)
   * SMS notifications
   *
   * مميزاته:
   * - وصول فوري
   * - لا يتطلب اتصال بالإنترنت
   * - مناسب للرسائل المهمة العاجلة
   *
   * Features:
   * - Instant delivery
   * - No internet connection required
   * - Suitable for urgent important messages
   */
  SMS = 'SMS',

  /**
   * الإشعارات داخل التطبيق
   * In-app notifications
   *
   * مميزاته:
   * - تظهر داخل واجهة التطبيق
   * - يمكن التفاعل معها مباشرة
   * - لا تتطلب اتصال خارجي
   *
   * Features:
   * - Appear within the application interface
   * - Can be interacted with directly
   * - No external connection required
   */
  IN_APP = 'IN_APP',

  /**
   * الإشعارات الفورية (Push Notifications)
   * Push notifications
   *
   * مميزاته:
   * - تظهر على سطح الجهاز
   * - تعمل حتى عندما يكون التطبيق مغلقاً
   * - فورية الوصول
   *
   * Features:
   * - Appear on device screen
   * - Work even when app is closed
   * - Instant delivery
   */
  PUSH = 'PUSH',

  /**
   * رسائل واتساب (إذا كان متوفراً)
   * WhatsApp messages (if available)
   *
   * مميزاته:
   * - معدل فتح عالي
   * - مناسب للتواصل الشخصي
   * - دعم الوسائط المتعددة
   *
   * Features:
   * - High open rate
   * - Suitable for personal communication
   * - Multimedia support
   */
  WHATSAPP = 'WHATSAPP',

  /**
   * إشعارات المتصفح (Web Push)
   * Browser notifications (Web Push)
   *
   * مميزاته:
   * - تعمل على متصفح الويب
   * - لا تتطلب تثبيت تطبيق
   * - مناسبة لمستخدمي الويب
   *
   * Features:
   * - Work on web browser
   * - No app installation required
   * - Suitable for web users
   */
  WEB_PUSH = 'WEB_PUSH',

  /**
   * إشعارات التطبيقات المكتبية
   * Desktop application notifications
   *
   * مميزاته:
   * - تظهر على نظام التشغيل
   * - مناسبة للتطبيقات المكتبية
   * - تكامل مع نظام التشغيل
   *
   * Features:
   * - Appear on operating system
   * - Suitable for desktop applications
   * - Integration with OS
   */
  DESKTOP = 'DESKTOP',

  /**
   * الإشعارات الصوتية (مكالمات)
   * Voice notifications (calls)
   *
   * مميزاته:
   * - مناسبة للرسائل المهمة جداً
   * - وصول مؤكد
   * - شخصية أكثر
   *
   * Features:
   * - Suitable for very important messages
   * - Confirmed delivery
   * - More personal
   */
  VOICE = 'VOICE',

  /**
   * إشعارات نظام التشغيل (OS Notifications)
   * Operating system notifications
   *
   * مميزاته:
   * - تكامل كامل مع نظام التشغيل
   * - إشعارات موحدة
   * - دعم لإجراءات سريعة
   *
   * Features:
   * - Full integration with OS
   * - Unified notifications
   * - Support for quick actions
   */
  OS_NOTIFICATION = 'OS_NOTIFICATION',
}

/**
 * خصائص كل قناة إشعار
 * Properties of each notification channel
 */
export interface ChannelProperties {
  /** السرعة النسبية للوصول */
  /** Relative delivery speed */
  speed: 'INSTANT' | 'FAST' | 'NORMAL' | 'SLOW';

  /** التكلفة النسبية */
  /** Relative cost */
  cost: 'FREE' | 'LOW' | 'MEDIUM' | 'HIGH';

  /** معدل الفتح المتوقع */
  /** Expected open rate */
  openRate: 'HIGH' | 'MEDIUM' | 'LOW';

  /** هل يتطلب اتصال بالإنترنت؟ */
  /** Requires internet connection? */
  requiresInternet: boolean;

  /** هل يتوفر في وضع الخلفية؟ */
  /** Available in background? */
  worksInBackground: boolean;

  /** الحد الأقصى لطول المحتوى */
  /** Maximum content length */
  maxContentLength?: number;

  /** هل يدعم الوسائط المتعددة؟ */
  /** Supports multimedia? */
  supportsMultimedia: boolean;

  /** هل يدعم التتبع؟ */
  /** Supports tracking? */
  supportsTracking: boolean;
}

/**
 * خصائص القنوات المختلفة
 * Properties of different channels
 */
export const CHANNEL_PROPERTIES: Record<
  NotificationChannel,
  ChannelProperties
> = {
  [NotificationChannel.EMAIL]: {
    speed: 'NORMAL',
    cost: 'LOW',
    openRate: 'MEDIUM',
    requiresInternet: true,
    worksInBackground: true,
    maxContentLength: 10000,
    supportsMultimedia: true,
    supportsTracking: true,
  },
  [NotificationChannel.SMS]: {
    speed: 'INSTANT',
    cost: 'MEDIUM',
    openRate: 'HIGH',
    requiresInternet: false,
    worksInBackground: true,
    maxContentLength: 160,
    supportsMultimedia: false,
    supportsTracking: true,
  },
  [NotificationChannel.IN_APP]: {
    speed: 'INSTANT',
    cost: 'FREE',
    openRate: 'HIGH',
    requiresInternet: true,
    worksInBackground: false,
    maxContentLength: 500,
    supportsMultimedia: true,
    supportsTracking: true,
  },
  [NotificationChannel.PUSH]: {
    speed: 'INSTANT',
    cost: 'FREE',
    openRate: 'HIGH',
    requiresInternet: true,
    worksInBackground: true,
    maxContentLength: 200,
    supportsMultimedia: true,
    supportsTracking: true,
  },
  [NotificationChannel.WHATSAPP]: {
    speed: 'FAST',
    cost: 'LOW',
    openRate: 'HIGH',
    requiresInternet: true,
    worksInBackground: true,
    maxContentLength: 1000,
    supportsMultimedia: true,
    supportsTracking: true,
  },
  [NotificationChannel.WEB_PUSH]: {
    speed: 'INSTANT',
    cost: 'FREE',
    openRate: 'MEDIUM',
    requiresInternet: true,
    worksInBackground: true,
    maxContentLength: 200,
    supportsMultimedia: true,
    supportsTracking: true,
  },
  [NotificationChannel.DESKTOP]: {
    speed: 'INSTANT',
    cost: 'FREE',
    openRate: 'HIGH',
    requiresInternet: false,
    worksInBackground: true,
    maxContentLength: 500,
    supportsMultimedia: true,
    supportsTracking: true,
  },
  [NotificationChannel.VOICE]: {
    speed: 'INSTANT',
    cost: 'HIGH',
    openRate: 'HIGH',
    requiresInternet: true,
    worksInBackground: true,
    maxContentLength: undefined,
    supportsMultimedia: false,
    supportsTracking: true,
  },
  [NotificationChannel.OS_NOTIFICATION]: {
    speed: 'INSTANT',
    cost: 'FREE',
    openRate: 'HIGH',
    requiresInternet: false,
    worksInBackground: true,
    maxContentLength: 500,
    supportsMultimedia: true,
    supportsTracking: true,
  },
};

/**
 * الحصول على خصائص قناة محددة
 * Get properties of a specific channel
 */
export function getChannelProperties(
  channel: NotificationChannel,
): ChannelProperties {
  return (
    CHANNEL_PROPERTIES[channel] || {
      speed: 'NORMAL',
      cost: 'MEDIUM',
      openRate: 'MEDIUM',
      requiresInternet: true,
      worksInBackground: false,
      supportsMultimedia: false,
      supportsTracking: false,
    }
  );
}

/**
 * تصنيف القنوات حسب الاستخدام
 * Channel classification by usage
 */
export enum ChannelCategory {
  /** قنوات فورية للرسائل المهمة */
  /** Instant channels for important messages */
  URGENT = 'URGENT',

  /** قنوات يومية للتواصل الاعتيادي */
  /** Daily channels for regular communication */
  REGULAR = 'REGULAR',

  /** قنوات للمحتوى الغني */
  /** Channels for rich content */
  RICH_CONTENT = 'RICH_CONTENT',

  /** قنوات احتياطية */
  /** Backup channels */
  BACKUP = 'BACKUP',
}

/**
 * تصنيف كل قناة
 * Classification of each channel
 */
export const CHANNEL_CATEGORIES: Record<NotificationChannel, ChannelCategory> =
  {
    [NotificationChannel.EMAIL]: ChannelCategory.RICH_CONTENT,
    [NotificationChannel.SMS]: ChannelCategory.URGENT,
    [NotificationChannel.IN_APP]: ChannelCategory.REGULAR,
    [NotificationChannel.PUSH]: ChannelCategory.URGENT,
    [NotificationChannel.WHATSAPP]: ChannelCategory.REGULAR,
    [NotificationChannel.WEB_PUSH]: ChannelCategory.URGENT,
    [NotificationChannel.DESKTOP]: ChannelCategory.REGULAR,
    [NotificationChannel.VOICE]: ChannelCategory.URGENT,
    [NotificationChannel.OS_NOTIFICATION]: ChannelCategory.REGULAR,
  };

/**
 * الحصول على القنوات المناسبة لنوع معين من الإشعارات
 * Get suitable channels for a specific notification type
 */
export function getRecommendedChannels(
  notificationType: string,
  priority: string,
): NotificationChannel[] {
  const recommendations: Record<string, NotificationChannel[]> = {
    // إشعارات مهمة وعاجلة
    // Important and urgent notifications
    URGENT: [
      NotificationChannel.SMS,
      NotificationChannel.PUSH,
      NotificationChannel.IN_APP,
    ],

    // إشعارات اعتيادية
    // Regular notifications
    REGULAR: [
      NotificationChannel.EMAIL,
      NotificationChannel.IN_APP,
      NotificationChannel.PUSH,
    ],

    // إشعارات تحتوي على محتوى غني
    // Notifications with rich content
    RICH_CONTENT: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],

    // إشعارات النظام والإعلانات
    // System notifications and announcements
    SYSTEM: [
      NotificationChannel.EMAIL,
      NotificationChannel.IN_APP,
      NotificationChannel.PUSH,
    ],
  };

  // تحديد الأولوية
  // Determine priority
  const priorityMap: Record<string, string> = {
    HIGH: 'URGENT',
    MEDIUM: 'REGULAR',
    LOW: 'RICH_CONTENT',
  };

  const category = priorityMap[priority] || 'REGULAR';
  return recommendations[category] || recommendations.REGULAR;
}
