/**
 * نوع الخبرة المهنية
 * Type of professional experience
 */
export enum ExperienceType {
  // عمل حكومي
  // Government work
  GOVERNMENT = 'GOVERNMENT',

  // عمل خاص
  // Private sector
  PRIVATE = 'PRIVATE',

  // عمل حر
  // Freelance
  FREELANCE = 'FREELANCE',

  // عمل أكاديمي
  // Academic
  ACADEMIC = 'ACADEMIC',

  // بحثي
  // Research
  RESEARCH = 'RESEARCH',

  // تطوعي
  // Volunteer
  VOLUNTEER = 'VOLUNTEER',

  // تدريب
  // Training/Internship
  TRAINING = 'TRAINING',

  // استشاري
  // Consultancy
  CONSULTANCY = 'CONSULTANCY',
}

/**
 * نوع التوظيف
 * Employment type
 */
export enum EmploymentType {
  // دوام كامل
  // Full-time
  FULL_TIME = 'FULL_TIME',

  // دوام جزئي
  // Part-time
  PART_TIME = 'PART_TIME',

  // عقد
  // Contract
  CONTRACT = 'CONTRACT',

  // مؤقت
  // Temporary
  TEMPORARY = 'TEMPORARY',

  // عمل حر
  // Freelance
  FREELANCE = 'FREELANCE',

  // تدريب
  // Internship
  INTERNSHIP = 'INTERNSHIP',
}

/**
 * مستوى الخبرة المهنية
 * Professional experience level
 */
export enum ExperienceLevel {
  // مبتدئ (0-2 سنة)
  // Entry Level (0-2 years)
  ENTRY = 'ENTRY',

  // متوسط (2-5 سنوات)
  // Mid Level (2-5 years)
  MID = 'MID',

  // متقدم (5-10 سنوات)
  // Senior Level (5-10 years)
  SENIOR = 'SENIOR',

  // خبير (أكثر من 10 سنوات)
  // Expert Level (10+ years)
  EXPERT = 'EXPERT',

  // قيادي (أكثر من 15 سنة)
  // Leadership Level (15+ years)
  LEADERSHIP = 'LEADERSHIP',
}

/**
 * مجال الخبرة
 * Experience field
 */
export enum ExperienceField {
  // هندسة زراعية
  // Agricultural Engineering
  AGRICULTURAL_ENGINEERING = 'AGRICULTURAL_ENGINEERING',

  // إدارة مزارع
  // Farm Management
  FARM_MANAGEMENT = 'FARM_MANAGEMENT',

  // أبحاث زراعية
  // Agricultural Research
  AGRICULTURAL_RESEARCH = 'AGRICULTURAL_RESEARCH',

  // إرشاد زراعي
  // Agricultural Extension
  AGRICULTURAL_EXTENSION = 'AGRICULTURAL_EXTENSION',

  // تسويق زراعي
  // Agricultural Marketing
  AGRICULTURAL_MARKETING = 'AGRICULTURAL_MARKETING',

  // تصنيع غذائي
  // Food Processing
  FOOD_PROCESSING = 'FOOD_PROCESSING',

  // إدارة موارد مائية
  // Water Resources Management
  WATER_RESOURCES_MANAGEMENT = 'WATER_RESOURCES_MANAGEMENT',

  // وقاية النبات
  // Plant Protection
  PLANT_PROTECTION = 'PLANT_PROTECTION',

  // تربية الحيوان
  // Animal Husbandry
  ANIMAL_HUSBANDRY = 'ANIMAL_HUSBANDRY',

  // هندسة الري
  // Irrigation Engineering
  IRRIGATION_ENGINEERING = 'IRRIGATION_ENGINEERING',
}

/**
 * حالة التحقق من الخبرة
 * Experience verification status
 */
export enum VerificationStatus {
  // غير مؤكد
  // Unconfirmed
  UNCONFIRMED = 'UNCONFIRMED',

  // قيد التحقق
  // Pending Verification
  PENDING = 'PENDING',

  // تم التحقق
  // Verified
  VERIFIED = 'VERIFIED',

  // مرفوض
  // Rejected
  REJECTED = 'REJECTED',
}
