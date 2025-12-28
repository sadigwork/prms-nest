/**
 * نوع المنشور العلمي
 * Type of scientific publication
 */
export enum PublicationType {
  // بحث علمي في مجلة محكمة
  // Scientific research in a refereed journal
  JOURNAL_ARTICLE = 'JOURNAL_ARTICLE',

  // مؤتمر علمي
  // Scientific conference
  CONFERENCE_PAPER = 'CONFERENCE_PAPER',

  // كتاب
  // Book
  BOOK = 'BOOK',

  // فصل في كتاب
  // Book chapter
  BOOK_CHAPTER = 'BOOK_CHAPTER',

  // تقرير علمي
  // Scientific report
  SCIENTIFIC_REPORT = 'SCIENTIFIC_REPORT',

  // رسالة ماجستير
  // Master's thesis
  MASTERS_THESIS = 'MASTERS_THESIS',

  // رسالة دكتوراه
  // Doctoral dissertation
  DOCTORAL_DISSERTATION = 'DOCTORAL_DISSERTATION',

  // ورقة عمل
  // Working paper
  WORKING_PAPER = 'WORKING_PAPER',

  // براءة اختراع
  // Patent
  PATENT = 'PATENT',

  // مقال في مجلة غير محكمة
  // Article in non-refereed journal
  MAGAZINE_ARTICLE = 'MAGAZINE_ARTICLE',
}

/**
 * حالة النشر
 * Publication status
 */
export enum PublicationStatus {
  // مقبول للنشر
  // Accepted for publication
  ACCEPTED = 'ACCEPTED',

  // منشور
  // Published
  PUBLISHED = 'PUBLISHED',

  // قيد النشر
  // In press
  IN_PRESS = 'IN_PRESS',

  // قيد المراجعة
  // Under review
  UNDER_REVIEW = 'UNDER_REVIEW',

  // مسودة
  // Draft
  DRAFT = 'DRAFT',

  // مرفوض
  // Rejected
  REJECTED = 'REJECTED',
}

/**
 * مستوى المجلة
 * Journal level
 */
export enum JournalLevel {
  // مجلة محلية
  // Local journal
  LOCAL = 'LOCAL',

  // مجلة عربية
  // Arab journal
  ARAB = 'ARAB',

  // مجلة دولية
  // International journal
  INTERNATIONAL = 'INTERNATIONAL',

  // مجلة مفهرسة في سكوبس
  // Scopus-indexed journal
  SCOPUS = 'SCOPUS',

  // مجلة مفهرسة في كلاريفيت
  // Clarivate-indexed journal
  CLARIVATE = 'CLARIVATE',
}

/**
 * دور المؤلف في البحث
 * Author's role in the research
 */
export enum AuthorRole {
  // المؤلف الرئيسي
  // Main author
  MAIN_AUTHOR = 'MAIN_AUTHOR',

  // المؤلف المشارك
  // Co-author
  CO_AUTHOR = 'CO_AUTHOR',

  // المشرف
  // Supervisor
  SUPERVISOR = 'SUPERVISOR',

  // المستشار
  // Consultant
  CONSULTANT = 'CONSULTANT',

  // الباحث المساعد
  // Research Assistant
  RESEARCH_ASSISTANT = 'RESEARCH_ASSISTANT',

  // المحرر
  // Editor
  EDITOR = 'EDITOR',

  // المراجع
  // Reviewer
  REVIEWER = 'REVIEWER',
}

/**
 * مجال البحث
 * Research field
 */
export enum ResearchField {
  // الهندسة الزراعية
  // Agricultural Engineering
  AGRICULTURAL_ENGINEERING = 'AGRICULTURAL_ENGINEERING',

  // علوم التربة
  // Soil Sciences
  SOIL_SCIENCES = 'SOIL_SCIENCES',

  // علوم النبات
  // Plant Sciences
  PLANT_SCIENCES = 'PLANT_SCIENCES',

  // علوم الحيوان
  // Animal Sciences
  ANIMAL_SCIENCES = 'ANIMAL_SCIENCES',

  // الاقتصاد الزراعي
  // Agricultural Economics
  AGRICULTURAL_ECONOMICS = 'AGRICULTURAL_ECONOMICS',

  // التكنولوجيا الحيوية
  // Biotechnology
  BIOTECHNOLOGY = 'BIOTECHNOLOGY',

  // علوم الأغذية
  // Food Sciences
  FOOD_SCIENCES = 'FOOD_SCIENCES',

  // الموارد المائية
  // Water Resources
  WATER_RESOURCES = 'WATER_RESOURCES',

  // الآلات الزراعية
  // Agricultural Machinery
  AGRICULTURAL_MACHINERY = 'AGRICULTURAL_MACHINERY',

  // البيئة الزراعية
  // Agricultural Environment
  AGRICULTURAL_ENVIRONMENT = 'AGRICULTURAL_ENVIRONMENT',
}
