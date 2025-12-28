import { Injectable, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TranslationLoader } from './translation.loader';

export interface TranslationData {
  [key: string]: string | TranslationData;
}

@Injectable()
export class I18nService {
  private translations: Map<string, TranslationData> = new Map();
  private defaultLanguage = 'ar';

  constructor(private translationLoader: TranslationLoader) {
    this.loadTranslations();
  }

  private loadTranslations(): void {
    const translationsDir = path.join(process.cwd(), 'translations');

    if (!fs.existsSync(translationsDir)) {
      fs.mkdirSync(translationsDir, { recursive: true });
    }

    const files = fs.readdirSync(translationsDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const language = file.replace('.json', '');
        const filePath = path.join(translationsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        this.translations.set(language, JSON.parse(content));
      }
    }
  }

  translate(
    key: string,
    language: string = this.defaultLanguage,
    params?: Record<string, any>,
  ): string {
    const translations =
      this.translations.get(language) ||
      this.translations.get(this.defaultLanguage) ||
      {};

    const value = this.getNestedValue(translations, key);

    if (!value || typeof value !== 'string') {
      return key; // العودة إلى المفتاح إذا لم توجد ترجمة
    }

    // استبدال المعاملات
    return this.replaceParams(value, params);
  }

  translatePlural(
    key: string,
    count: number,
    language: string = this.defaultLanguage,
    params?: Record<string, any>,
  ): string {
    // البحث عن النموذج المناسب للجمع
    const pluralKey = this.getPluralKey(key, count, language);
    return this.translate(pluralKey, language, { count, ...params });
  }

  private getNestedValue(obj: any, key: string): any {
    const keys = key.split('.');
    let value = obj;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    return value;
  }

  private replaceParams(text: string, params?: Record<string, any>): string {
    if (!params) return text;

    let result = text;

    for (const [key, value] of Object.entries(params)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return result;
  }

  private getPluralKey(
    baseKey: string,
    count: number,
    language: string,
  ): string {
    // قواعد الجمع تختلف حسب اللغة
    if (language === 'ar') {
      // العربية لديها ستة أشكال للجمع
      if (count === 0) return `${baseKey}.zero`;
      if (count === 1) return `${baseKey}.one`;
      if (count === 2) return `${baseKey}.two`;
      if (count >= 3 && count <= 10) return `${baseKey}.few`;
      return `${baseKey}.many`;
    } else {
      // الإنجليزية واللغات الأخرى
      if (count === 1) return `${baseKey}.one`;
      return `${baseKey}.other`;
    }
  }

  getAvailableLanguages(): string[] {
    return Array.from(this.translations.keys());
  }

  setDefaultLanguage(language: string): void {
    if (this.translations.has(language)) {
      this.defaultLanguage = language;
    }
  }

  getCurrentLanguage(): string {
    return this.defaultLanguage;
  }

  async loadTranslationFile(
    language: string,
    data: TranslationData,
  ): Promise<void> {
    this.translations.set(language, data);

    // حفظ في الملف
    const translationsDir = path.join(process.cwd(), 'translations');
    const filePath = path.join(translationsDir, `${language}.json`);

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      'utf8',
    );
  }
}
