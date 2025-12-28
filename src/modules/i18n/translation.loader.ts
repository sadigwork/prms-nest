import { Injectable, OnModuleInit } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Injectable()
export class TranslationLoader implements OnModuleInit {
  constructor(private i18nService: I18nService) {}

  async onModuleInit() {
    await this.loadDefaultTranslations();
  }

  private async loadDefaultTranslations(): Promise<void> {
    const arabicTranslations = {
      // الترحيب والمصادقة
      auth: {
        welcome: 'مرحباً بك في نظام التسجيل المهني',
        login_success: 'تم تسجيل الدخول بنجاح',
        register_success: 'تم إنشاء الحساب بنجاح',
        invalid_credentials: 'بيانات الدخول غير صحيحة',
        account_locked: 'الحساب مغلق، يرجى التواصل مع الإدارة',
      },

      // المستخدمين
      users: {
        created: 'تم إنشاء المستخدم بنجاح',
        updated: 'تم تحديث بيانات المستخدم',
        deleted: 'تم حذف المستخدم',
        not_found: 'المستخدم غير موجود',
        profile_updated: 'تم تحديث الملف الشخصي',
      },

      // المؤهلات
      qualifications: {
        added: 'تم إضافة المؤهل العلمي',
        updated: 'تم تحديث المؤهل العلمي',
        deleted: 'تم حذف المؤهل العلمي',
        verified: 'تم التحقق من المؤهل العلمي',
        verification_pending: 'في انتظار التحقق',
      },

      // الخبرات
      experiences: {
        added: 'تم إضافة الخبرة المهنية',
        updated: 'تم تحديث الخبرة المهنية',
        deleted: 'تم حذف الخبرة المهنية',
        years: {
          one: 'سنة',
          two: 'سنتين',
          few: '{{count}} سنوات',
          many: '{{count}} سنة',
        },
      },

      // الألقاب المهنية
      titles: {
        applied: 'تم تقديم طلب اللقب المهني',
        under_review: 'طلب اللقب قيد المراجعة',
        approved: 'تم منح اللقب المهني',
        rejected: 'تم رفض منح اللقب',
        requirements_not_met: 'لا تستوفي متطلبات اللقب',
        evaluation_complete: 'تم تقييم الطلب',
      },

      // الإشعارات
      notifications: {
        welcome: {
          title: 'مرحباً بك في النظام',
          message:
            'مرحباً {{userName}}، شكراً لتسجيلك في نظام التسجيل المهني للمهندسين والتقنيين الزراعيين. يمكنك الآن البدء في إكمال ملفك المهني.',
        },
        title_application_submitted: {
          title: 'تم تقديم طلب اللقب',
          message:
            'تم تقديم طلبك للحصول على لقب {{titleLevel}} بنجاح. رقم الطلب: {{applicationId}}',
        },
        title_approved: {
          title: 'تم منح اللقب المهني',
          message:
            'مبروك! تم منحك لقب {{titleLevel}} برقم الشهادة {{certificateNumber}} بتاريخ {{approvalDate}}.',
        },
        document_verified: {
          title: 'تم التحقق من المستند',
          message:
            'تم التحقق من مستند {{documentType}} الخاص بك من قبل {{verifiedBy}} بتاريخ {{verificationDate}}.',
        },
        system_announcement: {
          title: 'إعلان نظام: {{announcementTitle}}',
          message: '{{announcementMessage}}',
        },
        new_application: {
          title: 'طلب جديد للمراجعة',
          message:
            'هناك طلب جديد للحصول على لقب {{titleLevel}} من قبل {{applicantName}}.',
        },
      },

      // الرسائل التحقق
      validation: {
        required: 'هذا الحقل مطلوب',
        email: 'البريد الإلكتروني غير صالح',
        min_length: 'يجب أن يحتوي على الأقل {{count}} حرف',
        max_length: 'يجب ألا يزيد عن {{count}} حرف',
        pattern: 'التنسيق غير صحيح',
        unique: 'القيمة موجودة مسبقاً',
        password_strength:
          'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز',
        date_format: 'صيغة التاريخ غير صحيحة',
        phone_number: 'رقم الهاتف غير صالح',
        national_id: 'رقم الهوية الوطنية غير صالح',
      },

      // الأخطاء
      errors: {
        server_error: 'خطأ في الخادم',
        not_found: 'الصفحة غير موجودة',
        forbidden: 'غير مصرح لك بالوصول',
        unauthorized: 'غير مصرح، يرجى تسجيل الدخول',
        rate_limit: 'لقد تجاوزت الحد المسموح به، يرجى المحاولة لاحقاً',
        maintenance: 'النظام قيد الصيانة',
      },

      // الأدوار
      roles: {
        admin: 'مدير النظام',
        registrar: 'مسجل',
        reviewer: 'مراجع',
        applicant: 'مقدم الطلب',
        engineer: 'مهندس',
        technician: 'تقني',
      },

      // الألقاب
      professional_titles: {
        technician_assistant: 'تقني زراعي مساعد',
        technician: 'تقني زراعي',
        assistant_engineer: 'مهندس زراعي مساعد',
        engineer: 'مهندس زراعي',
        senior_engineer: 'مهندس زراعي أول',
        consultant_engineer: 'مهندس زراعي استشاري',
      },

      // مستويات التعليم
      education_levels: {
        diploma: 'دبلوم',
        bachelor: 'بكالوريوس',
        master: 'ماجستير',
        phd: 'دكتوراه',
      },

      // أنواع الخبرة
      experience_types: {
        full_time: 'دوام كامل',
        part_time: 'دوام جزئي',
        contract: 'عقد',
        freelance: 'عمل حر',
        internship: 'تدريب',
      },
    };

    const englishTranslations = {
      auth: {
        welcome: 'Welcome to the Professional Registry System',
        login_success: 'Logged in successfully',
        register_success: 'Account created successfully',
        invalid_credentials: 'Invalid credentials',
        account_locked: 'Account is locked, please contact administration',
      },
      // ... باقي الترجمات الإنجليزية
    };

    await this.i18nService.loadTranslationFile('ar', arabicTranslations);
    await this.i18nService.loadTranslationFile('en', englishTranslations);
  }
}
