/**
 * أدوار المستخدم في النظام
 * User roles in the system
 */
export enum UserRole {
  // مدير النظام - صلاحيات كاملة
  // System administrator - full permissions
  ADMIN = 'ADMIN',

  // مسجل - يمكنه تسجيل ومراجعة طلبات المستخدمين
  // Registrar - can register and review user applications
  REGISTRAR = 'REGISTRAR',

  // مراجع - يمكنه مراجعة وتقييم طلبات الألقاب
  // Reviewer - can review and evaluate title applications
  REVIEWER = 'REVIEWER',

  // مقدم الطلب - مهندس/تقني يقدم طلب للحصول على لقب
  // Applicant - engineer/technician applying for a title
  APPLICANT = 'APPLICANT',

  // مهندس - تم منحه لقب مهندس
  // Engineer - granted engineer title
  ENGINEER = 'ENGINEER',

  // تقني - تم منحه لقب تقني
  // Technician - granted technician title
  TECHNICIAN = 'TECHNICIAN',
}

/**
 * حالة حساب المستخدم
 * User account status
 */
export enum UserStatus {
  // قيد الانتظار - بعد التسجيل مباشرة
  // Pending - right after registration
  PENDING = 'PENDING',

  // نشط - تم التحقق من الحساب
  // Active - account verified
  ACTIVE = 'ACTIVE',

  // معلق - مؤقتاً بسبب مخالفات
  // Suspended - temporarily due to violations
  SUSPENDED = 'SUSPENDED',

  // محظور - بشكل دائم
  // Banned - permanently
  BANNED = 'BANNED',

  // غير مكتمل - يحتاج إكمال البيانات
  // Incomplete - needs to complete data
  INCOMPLETE = 'INCOMPLETE',

  // قيد المراجعة - بيانات قيد التحقق
  // Under Review - data being verified
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * جنس المستخدم
 * User gender
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

/**
 * حالة توثيق الحساب
 * Account verification status
 */
export enum VerificationStatus {
  // غير موثق
  // Not verified
  NOT_VERIFIED = 'NOT_VERIFIED',

  // قيد التوثيق
  // Verification in progress
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',

  // موثق جزئياً
  // Partially verified
  PARTIALLY_VERIFIED = 'PARTIALLY_VERIFIED',

  // موثق كلياً
  // Fully verified
  FULLY_VERIFIED = 'FULLY_VERIFIED',
}
