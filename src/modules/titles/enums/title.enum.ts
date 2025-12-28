/**
 * مستويات الألقاب المهنية
 * Professional title levels
 */
export enum TitleLevel {
  // تقني زراعي مساعد
  // Agricultural Technician Assistant
  TECHNICIAN_ASSISTANT = 'TECHNICIAN_ASSISTANT',

  // تقني زراعي
  // Agricultural Technician
  TECHNICIAN = 'TECHNICIAN',

  // مهندس زراعي مساعد
  // Assistant Agricultural Engineer
  ASSISTANT_ENGINEER = 'ASSISTANT_ENGINEER',

  // مهندس زراعي
  // Agricultural Engineer
  ENGINEER = 'ENGINEER',

  // مهندس زراعي أول
  // Senior Agricultural Engineer
  SENIOR_ENGINEER = 'SENIOR_ENGINEER',

  // مهندس زراعي استشاري
  // Consultant Agricultural Engineer
  CONSULTANT_ENGINEER = 'CONSULTANT_ENGINEER',
}

/**
 * حالة طلب اللقب المهني
 * Professional title application status
 */
export enum TitleStatus {
  // مسودة - لم يتم تقديمه بعد
  // Draft - not submitted yet
  DRAFT = 'DRAFT',

  // قيد الانتظار - تم تقديمه
  // Pending - submitted
  PENDING = 'PENDING',

  // قيد المراجعة - قيد التقييم
  // Under Review - being evaluated
  UNDER_REVIEW = 'UNDER_REVIEW',

  // يحتاج معلومات إضافية
  // Needs Additional Information
  REQUIRES_ADDITIONAL_INFO = 'REQUIRES_ADDITIONAL_INFO',

  // تمت الموافقة
  // Approved
  APPROVED = 'APPROVED',

  // مرفوض
  // Rejected
  REJECTED = 'REJECTED',

  // معلق
  // Suspended
  SUSPENDED = 'SUSPENDED',

  // منتهي الصلاحية
  // Expired
  EXPIRED = 'EXPIRED',
}

/**
 * فئة اللقب المهني
 * Professional title category
 */
export enum TitleCategory {
  // هندسة زراعية
  // Agricultural Engineering
  AGRICULTURAL_ENGINEERING = 'AGRICULTURAL_ENGINEERING',

  // تقنية زراعية
  // Agricultural Technology
  AGRICULTURAL_TECHNOLOGY = 'AGRICULTURAL_TECHNOLOGY',

  // هندسة الري
  // Irrigation Engineering
  IRRIGATION_ENGINEERING = 'IRRIGATION_ENGINEERING',

  // هندسة التربة
  // Soil Engineering
  SOIL_ENGINEERING = 'SOIL_ENGINEERING',

  // هندسة الآلات الزراعية
  // Agricultural Machinery Engineering
  AGRICULTURAL_MACHINERY_ENGINEERING = 'AGRICULTURAL_MACHINERY_ENGINEERING',
}

/**
 * فترة سريان اللقب المهني
 * Title validity period
 */
export enum TitleValidityPeriod {
  // 3 سنوات
  // 3 years
  THREE_YEARS = 'THREE_YEARS',

  // 5 سنوات
  // 5 years
  FIVE_YEARS = 'FIVE_YEARS',

  // 10 سنوات
  // 10 years
  TEN_YEARS = 'TEN_YEARS',

  // دائم
  // Permanent
  PERMANENT = 'PERMANENT',
}
