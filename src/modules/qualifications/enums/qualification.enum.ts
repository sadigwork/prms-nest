/**
 * نوع المؤهل التعليمي
 * Type of educational qualification
 */
export enum QualificationType {
  // شهادة ثانوية عامة
  // General Secondary Certificate
  SECONDARY = 'SECONDARY',

  // دبلوم
  // Diploma
  DIPLOMA = 'DIPLOMA',

  // بكالوريوس
  // Bachelor's Degree
  BACHELOR = 'BACHELOR',

  // ماجستير
  // Master's Degree
  MASTER = 'MASTER',

  // دكتوراه
  // Doctorate (PhD)
  DOCTORATE = 'DOCTORATE',

  // شهادة مهنية
  // Professional Certificate
  PROFESSIONAL_CERTIFICATE = 'PROFESSIONAL_CERTIFICATE',

  // دورة تدريبية
  // Training Course
  TRAINING_COURSE = 'TRAINING_COURSE',

  // ورشة عمل
  // Workshop
  WORKSHOP = 'WORKSHOP',

  // مؤتمر
  // Conference
  CONFERENCE = 'CONFERENCE',

  // برنامج تدريبي
  // Training Program
  TRAINING_PROGRAM = 'TRAINING_PROGRAM',
}

/**
 * مستوى التعليم
 * Education level
 */
export enum EducationLevel {
  // ثانوية عامة
  // General Secondary
  SECONDARY = 'SECONDARY',

  // دبلوم
  // Diploma
  DIPLOMA = 'DIPLOMA',

  // بكالوريوس
  // Bachelor
  BACHELOR = 'BACHELOR',

  // ماجستير
  // Master
  MASTER = 'MASTER',

  // دكتوراه
  // Doctorate
  DOCTORATE = 'DOCTORATE',
}

/**
 * حالة المؤهل
 * Qualification status
 */
export enum QualificationStatus {
  // قيد الدراسة
  // In Progress
  IN_PROGRESS = 'IN_PROGRESS',

  // مكتمل
  // Completed
  COMPLETED = 'COMPLETED',

  // موقف
  // Suspended
  SUSPENDED = 'SUSPENDED',

  // ملغي
  // Cancelled
  CANCELLED = 'CANCELLED',
}

/**
 * نظام الدراسة
 * Study system
 */
export enum StudySystem {
  // منتظم
  // Regular
  REGULAR = 'REGULAR',

  // انتساب
  // Distance Learning
  DISTANCE_LEARNING = 'DISTANCE_LEARNING',

  // تعليم مفتوح
  // Open Education
  OPEN_EDUCATION = 'OPEN_EDUCATION',

  // تعليم عن بعد
  // Online Education
  ONLINE_EDUCATION = 'ONLINE_EDUCATION',
}

/**
 * تقدير التخرج
 * Graduation grade
 */
export enum GraduationGrade {
  // امتياز مع مرتبة الشرف
  // Excellent with Honors
  EXCELLENT_HONORS = 'EXCELLENT_HONORS',

  // امتياز
  // Excellent
  EXCELLENT = 'EXCELLENT',

  // جيد جداً
  // Very Good
  VERY_GOOD = 'VERY_GOOD',

  // جيد
  // Good
  GOOD = 'GOOD',

  // مقبول
  // Pass
  PASS = 'PASS',

  // راسب
  // Fail
  FAIL = 'FAIL',
}
