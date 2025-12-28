import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

/**
 * واجهة بيانات الترجمة
 * Translation data interface
 */
export interface TranslationData {
  [key: string]: string | TranslationData;
}

/**
 * واجهة خيارات الترجمة
 * Translation options interface
 */
export interface TranslationOptions {
  count?: number;
  context?: string;
  [key: string]: any;
}

/**
 * خدمة الترجمة الدولية (i18n)
 * Internationalization (i18n) service
 */
@Injectable()
export class I18nService implements OnModuleInit {
  private translations: Map<string, TranslationData> = new Map();
  private defaultLanguage: string = 'ar';
  private availableLanguages: string[] = ['ar', 'en'];

  constructor(private configService: ConfigService) {}

  /**
   * تهيئة الخدمة عند بدء التشغيل
   * Initialize service on startup
   */
  async onModuleInit(): Promise<void> {
    this.defaultLanguage = this.configService.get<string>(
      'DEFAULT_LANGUAGE',
      'ar',
    );
    this.availableLanguages = this.configService
      .get<string>('SUPPORTED_LANGUAGES', 'ar,en')
      .split(',');

    await this.loadTranslations();
  }

  /**
   * تحميل ملفات الترجمة
   * Load translation files
   */
  private async loadTranslations(): Promise<void> {
    const translationsDir = path.join(process.cwd(), 'translations');

    // إنشاء مجلد الترجمات إذا لم يكن موجوداً
    // Create translations directory if it doesn't exist
    if (!fs.existsSync(translationsDir)) {
      fs.mkdirSync(translationsDir, { recursive: true });
      await this.createDefaultTranslations();
    }

    // تحميل جميع ملفات الترجمة
    // Load all translation files
    for (const lang of this.availableLanguages) {
      const filePath = path.join(translationsDir, `${lang}.json`);

      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const translations = JSON.parse(content);
          this.translations.set(lang, translations);
          console.log(`Loaded translations for language: ${lang}`);
        } catch (error) {
          console.error(
            `Error loading translations for ${lang}:`,
            error.message,
          );
        }
      } else {
        console.warn(`Translation file not found for language: ${lang}`);
      }
    }

    // التأكد من وجود اللغة الافتراضية
    // Ensure default language exists
    if (!this.translations.has(this.defaultLanguage)) {
      throw new Error(
        `Default language (${this.defaultLanguage}) translations not found`,
      );
    }
  }

  /**
   * إنشاء ترجمات افتراضية
   * Create default translations
   */
  private async createDefaultTranslations(): Promise<void> {
    const translationsDir = path.join(process.cwd(), 'translations');

    // الترجمات العربية
    // Arabic translations
    const arabicTranslations: TranslationData = {
      common: {
        yes: 'نعم',
        no: 'لا',
        save: 'حفظ',
        cancel: 'إلغاء',
        edit: 'تعديل',
        delete: 'حذف',
        search: 'بحث',
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        success: 'تمت العملية بنجاح',
        warning: 'تحذير',
        info: 'معلومة',
        confirm: 'تأكيد',
        back: 'رجوع',
        next: 'التالي',
        previous: 'السابق',
        finish: 'إنهاء',
      },
      auth: {
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        register: 'تسجيل جديد',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirm_password: 'تأكيد كلمة المرور',
        forgot_password: 'نسيت كلمة المرور؟',
        remember_me: 'تذكرني',
        login_success: 'تم تسجيل الدخول بنجاح',
        register_success: 'تم إنشاء الحساب بنجاح',
        invalid_credentials: 'بيانات الدخول غير صحيحة',
        email_exists: 'البريد الإلكتروني مسجل بالفعل',
        weak_password: 'كلمة المرور ضعيفة',
        account_locked: 'الحساب مغلق',
        verification_required: 'يجب التحقق من البريد الإلكتروني',
      },
      validation: {
        required: 'هذا الحقل مطلوب',
        invalid_email: 'البريد الإلكتروني غير صالح',
        min_length: 'يجب أن يحتوي على الأقل {{count}} حرف',
        max_length: 'يجب ألا يزيد عن {{count}} حرف',
        invalid_pattern: 'التنسيق غير صحيح',
        not_unique: 'القيمة موجودة مسبقاً',
        password_mismatch: 'كلمات المرور غير متطابقة',
        invalid_date: 'تاريخ غير صالح',
        invalid_phone: 'رقم الهاتف غير صالح',
        invalid_national_id: 'رقم الهوية الوطنية غير صالح',
      },
      user: {
        profile: 'الملف الشخصي',
        settings: 'الإعدادات',
        notifications: 'الإشعارات',
        logout: 'تسجيل الخروج',
        role: {
          admin: 'مدير النظام',
          registrar: 'مسجل',
          reviewer: 'مراجع',
          applicant: 'مقدم طلب',
          engineer: 'مهندس',
          technician: 'تقني',
        },
        status: {
          active: 'نشط',
          pending: 'قيد الانتظار',
          suspended: 'معلق',
          banned: 'محظور',
          incomplete: 'غير مكتمل',
          under_review: 'قيد المراجعة',
        },
      },
      titles: {
        application: 'طلب لقب',
        level: {
          technician_assistant: 'تقني زراعي مساعد',
          technician: 'تقني زراعي',
          assistant_engineer: 'مهندس زراعي مساعد',
          engineer: 'مهندس زراعي',
          senior_engineer: 'مهندس زراعي أول',
          consultant_engineer: 'مهندس زراعي استشاري',
        },
        status: {
          draft: 'مسودة',
          pending: 'قيد الانتظار',
          under_review: 'قيد المراجعة',
          requires_additional_info: 'يحتاج معلومات إضافية',
          approved: 'تمت الموافقة',
          rejected: 'مرفوض',
          suspended: 'معلق',
          expired: 'منتهي الصلاحية',
        },
      },
      notifications: {
        title: 'الإشعارات',
        mark_all_read: 'تعليم الكل كمقروء',
        no_notifications: 'لا توجد إشعارات',
        types: {
          welcome: 'ترحيب',
          title_application_submitted: 'تقديم طلب لقب',
          title_approved: 'موافقة على اللقب',
          title_rejected: 'رفض اللقب',
          document_verified: 'تحقق المستند',
          system_announcement: 'إعلان نظام',
        },
      },
      errors: {
        server_error: 'خطأ في الخادم',
        not_found: 'غير موجود',
        forbidden: 'غير مصرح',
        unauthorized: 'غير مصرح، يرجى تسجيل الدخول',
        rate_limit: 'لقد تجاوزت الحد المسموح',
        maintenance: 'النظام قيد الصيانة',
        network_error: 'خطأ في الاتصال',
        timeout: 'انتهى وقت الانتظار',
      },
    };

    // الترجمات الإنجليزية
    // English translations
    const englishTranslations: TranslationData = {
      common: {
        yes: 'Yes',
        no: 'No',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Operation completed successfully',
        warning: 'Warning',
        info: 'Information',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Password',
        forgot_password: 'Forgot Password?',
        remember_me: 'Remember Me',
        login_success: 'Logged in successfully',
        register_success: 'Account created successfully',
        invalid_credentials: 'Invalid credentials',
        email_exists: 'Email already exists',
        weak_password: 'Weak password',
        account_locked: 'Account is locked',
        verification_required: 'Email verification required',
      },
      validation: {
        required: 'This field is required',
        invalid_email: 'Invalid email address',
        min_length: 'Must be at least {{count}} characters',
        max_length: 'Must not exceed {{count}} characters',
        invalid_pattern: 'Invalid format',
        not_unique: 'Value already exists',
        password_mismatch: 'Passwords do not match',
        invalid_date: 'Invalid date',
        invalid_phone: 'Invalid phone number',
        invalid_national_id: 'Invalid national ID',
      },
      user: {
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications',
        logout: 'Logout',
        role: {
          admin: 'System Administrator',
          registrar: 'Registrar',
          reviewer: 'Reviewer',
          applicant: 'Applicant',
          engineer: 'Engineer',
          technician: 'Technician',
        },
        status: {
          active: 'Active',
          pending: 'Pending',
          suspended: 'Suspended',
          banned: 'Banned',
          incomplete: 'Incomplete',
          under_review: 'Under Review',
        },
      },
      titles: {
        application: 'Title Application',
        level: {
          technician_assistant: 'Agricultural Technician Assistant',
          technician: 'Agricultural Technician',
          assistant_engineer: 'Assistant Agricultural Engineer',
          engineer: 'Agricultural Engineer',
          senior_engineer: 'Senior Agricultural Engineer',
          consultant_engineer: 'Consultant Agricultural Engineer',
        },
        status: {
          draft: 'Draft',
          pending: 'Pending',
          under_review: 'Under Review',
          requires_additional_info: 'Requires Additional Info',
          approved: 'Approved',
          rejected: 'Rejected',
          suspended: 'Suspended',
          expired: 'Expired',
        },
      },
      notifications: {
        title: 'Notifications',
        mark_all_read: 'Mark All as Read',
        no_notifications: 'No notifications',
        types: {
          welcome: 'Welcome',
          title_application_submitted: 'Title Application Submitted',
          title_approved: 'Title Approved',
          title_rejected: 'Title Rejected',
          document_verified: 'Document Verified',
          system_announcement: 'System Announcement',
        },
      },
      errors: {
        server_error: 'Server Error',
        not_found: 'Not Found',
        forbidden: 'Forbidden',
        unauthorized: 'Unauthorized, please login',
        rate_limit: 'Rate limit exceeded',
        maintenance: 'System under maintenance',
        network_error: 'Network Error',
        timeout: 'Timeout',
      },
    };

    // حفظ ملفات الترجمة
    // Save translation files
    fs.writeFileSync(
      path.join(translationsDir, 'ar.json'),
      JSON.stringify(arabicTranslations, null, 2),
      'utf8',
    );

    fs.writeFileSync(
      path.join(translationsDir, 'en.json'),
      JSON.stringify(englishTranslations, null, 2),
      'utf8',
    );

    console.log('Default translation files created');
  }

  /**
   * ترجمة مفتاح معين
   * Translate a specific key
   *
   * @param key مفتاح الترجمة
   * @param key Translation key
   * @param language اللغة المطلوبة (اختياري)
   * @param language Desired language (optional)
   * @param options خيارات الترجمة
   * @param options Translation options
   * @returns النص المترجم
   * @returns Translated text
   */
  translate(
    key: string,
    language?: string,
    options?: TranslationOptions,
  ): string {
    const lang = language || this.defaultLanguage;

    // الحصول على الترجمات للغة المطلوبة أو اللغة الافتراضية
    // Get translations for requested language or default language
    let translations = this.translations.get(lang);
    if (!translations) {
      translations = this.translations.get(this.defaultLanguage);
    }

    if (!translations) {
      console.warn(`No translations available for language: ${lang}`);
      return key;
    }

    // البحث عن الترجمة باستخدام المسار المكون من نقاط
    // Find translation using dot notation path
    const value = this.getNestedValue(translations, key);

    if (typeof value !== 'string') {
      // إذا لم توجد ترجمة، حاول استخدام اللغة الافتراضية
      // If translation not found, try default language
      if (lang !== this.defaultLanguage) {
        return this.translate(key, this.defaultLanguage, options);
      }

      // إذا لم توجد ترجمة في اللغة الافتراضية أيضاً، ارجع المفتاح
      // If translation not found in default language either, return key
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // استبدال المعاملات إذا وجدت
    // Replace parameters if they exist
    return this.replaceParameters(value, options);
  }

  /**
   * ترجمة مع دعم الجمع (Pluralization)
   * Translate with plural support
   *
   * @param key مفتاح الترجمة
   * @param key Translation key
   * @param count العدد
   * @param count The count
   * @param language اللغة (اختياري)
   * @param language Language (optional)
   * @param options خيارات إضافية
   * @param options Additional options
   * @returns النص المترجم
   * @returns Translated text
   */
  translatePlural(
    key: string,
    count: number,
    language?: string,
    options?: TranslationOptions,
  ): string {
    const lang = language || this.defaultLanguage;
    let pluralKey = key;

    // تحديد مفتاح الجمع المناسب بناءً على اللغة
    // Determine appropriate plural key based on language
    if (lang === 'ar') {
      // قواعد الجمع في العربية
      // Arabic plural rules
      if (count === 0) {
        pluralKey = `${key}.zero`;
      } else if (count === 1) {
        pluralKey = `${key}.one`;
      } else if (count === 2) {
        pluralKey = `${key}.two`;
      } else if (count >= 3 && count <= 10) {
        pluralKey = `${key}.few`;
      } else {
        pluralKey = `${key}.many`;
      }
    } else {
      // قواعد الجمع في الإنجليزية واللغات الأخرى
      // English and other languages plural rules
      if (count === 1) {
        pluralKey = `${key}.one`;
      } else {
        pluralKey = `${key}.other`;
      }
    }

    // إضافة العدد إلى الخيارات
    // Add count to options
    const finalOptions = { count, ...options };

    // محاولة ترجمة مفتاح الجمع
    // Try to translate plural key
    const translation = this.translate(pluralKey, lang, finalOptions);

    // إذا لم توجد ترجمة للجمع، استخدم الترجمة العادية
    // If no plural translation found, use regular translation
    if (translation === pluralKey) {
      return this.translate(key, lang, finalOptions);
    }

    return translation;
  }

  /**
   * الحصول على قيمة متداخلة من كائن
   * Get nested value from object
   *
   * @param obj الكائن
   * @param obj The object
   * @param path المسار
   * @param path The path
   * @returns القيمة
   * @returns The value
   */
  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }

    return value;
  }

  /**
   * استبدال المعاملات في النص
   * Replace parameters in text
   *
   * @param text النص
   * @param text The text
   * @param options الخيارات
   * @param options Options
   * @returns النص مع المعاملات المستبدلة
   * @returns Text with replaced parameters
   */
  private replaceParameters(
    text: string,
    options?: TranslationOptions,
  ): string {
    if (!options) return text;

    let result = text;

    for (const [key, value] of Object.entries(options)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return result;
  }

  /**
   * الحصول على قائمة اللغات المتاحة
   * Get list of available languages
   *
   * @returns اللغات المتاحة
   * @returns Available languages
   */
  getAvailableLanguages(): string[] {
    return [...this.availableLanguages];
  }

  /**
   * تعيين اللغة الافتراضية
   * Set default language
   *
   * @param language اللغة
   * @param language The language
   */
  setDefaultLanguage(language: string): void {
    if (this.availableLanguages.includes(language)) {
      this.defaultLanguage = language;
    } else {
      console.warn(`Language ${language} is not available`);
    }
  }

  /**
   * الحصول على اللغة الافتراضية الحالية
   * Get current default language
   *
   * @returns اللغة الافتراضية
   * @returns Default language
   */
  getDefaultLanguage(): string {
    return this.defaultLanguage;
  }

  /**
   * التحقق مما إذا كانت اللغة مدعومة
   * Check if language is supported
   *
   * @param language اللغة
   * @param language The language
   * @returns هل اللغة مدعومة؟
   * @returns Is language supported?
   */
  isLanguageSupported(language: string): boolean {
    return this.availableLanguages.includes(language);
  }

  /**
   * إضافة ترجمات جديدة ديناميكياً
   * Add new translations dynamically
   *
   * @param language اللغة
   * @param language The language
   * @param translations الترجمات
   * @param translations Translations
   */
  addTranslations(language: string, translations: TranslationData): void {
    if (!this.availableLanguages.includes(language)) {
      this.availableLanguages.push(language);
    }

    const existing = this.translations.get(language) || {};
    this.mergeTranslations(existing, translations);
    this.translations.set(language, existing);
  }

  /**
   * دمج الترجمات
   * Merge translations
   *
   * @param target الهدف
   * @param target Target
   * @param source المصدر
   * @param source Source
   */
  private mergeTranslations(
    target: TranslationData,
    source: TranslationData,
  ): void {
    for (const [key, value] of Object.entries(source)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        typeof target[key] === 'object'
      ) {
        this.mergeTranslations(
          target[key] as TranslationData,
          value as TranslationData,
        );
      } else {
        target[key] = value;
      }
    }
  }

  /**
   * الحصول على جميع الترجمات للغة معينة
   * Get all translations for a specific language
   *
   * @param language اللغة
   * @param language The language
   * @returns جميع الترجمات
   * @returns All translations
   */
  getAllTranslations(language: string = this.defaultLanguage): TranslationData {
    return this.translations.get(language) || {};
  }

  /**
   * تصدير الترجمات لغة معينة
   * Export translations for a specific language
   *
   * @param language اللغة
   * @param language The language
   * @returns الترجمات كـ JSON
   * @returns Translations as JSON
   */
  exportTranslations(language: string): string {
    const translations = this.translations.get(language);
    if (!translations) {
      throw new Error(`No translations found for language: ${language}`);
    }

    return JSON.stringify(translations, null, 2);
  }

  /**
   * استيراد ترجمات من JSON
   * Import translations from JSON
   *
   * @param language اللغة
   * @param language The language
   * @param jsonString سلسلة JSON
   * @param jsonString JSON string
   */
  importTranslations(language: string, jsonString: string): void {
    try {
      const translations = JSON.parse(jsonString);
      this.addTranslations(language, translations);

      // حفظ في الملف
      // Save to file
      const translationsDir = path.join(process.cwd(), 'translations');
      const filePath = path.join(translationsDir, `${language}.json`);

      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');

      console.log(`Translations imported for language: ${language}`);
    } catch (error) {
      console.error(
        `Error importing translations for ${language}:`,
        error.message,
      );
      throw new Error('Invalid JSON format');
    }
  }
}
