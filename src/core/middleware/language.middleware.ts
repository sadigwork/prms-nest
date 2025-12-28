import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { I18nService } from '../../modules/i18n/i18n.service';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  constructor(private i18nService: I18nService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // تحديد اللغة من:
    // 1. query parameter
    // 2. header
    // 3. cookie
    // 4. default

    let language = 'ar'; // الافتراضي العربية

    if (req.query.lang && this.isValidLanguage(req.query.lang as string)) {
      language = req.query.lang as string;
    } else if (req.headers['accept-language']) {
      const headerLang = req.headers['accept-language']
        .split(',')[0]
        .split('-')[0];
      if (this.isValidLanguage(headerLang)) {
        language = headerLang;
      }
    } else if (req.cookies?.language) {
      if (this.isValidLanguage(req.cookies.language)) {
        language = req.cookies.language;
      }
    }

    // إضافة اللغة إلى request object
    req['language'] = language;

    // إضافة header للاستجابة
    res.setHeader('Content-Language', language);

    next();
  }

  private isValidLanguage(lang: string): boolean {
    const validLanguages = ['ar', 'en'];
    return validLanguages.includes(lang);
  }
}
