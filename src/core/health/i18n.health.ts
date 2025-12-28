import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { I18nService } from '../../modules/i18n/i18n.service';

@Injectable()
export class I18nHealthIndicator extends HealthIndicator {
  constructor(private i18nService: I18nService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const languages = this.i18nService.getAvailableLanguages();
      const currentLanguage = this.i18nService.getCurrentLanguage();

      // اختبار ترجمة نموذجية
      const testTranslation = this.i18nService.translate(
        'auth.welcome',
        currentLanguage,
      );

      const isHealthy =
        languages.length > 0 && testTranslation !== 'auth.welcome';

      const result = this.getStatus(key, isHealthy, {
        availableLanguages: languages,
        currentLanguage,
        defaultLanguage: 'ar',
        testTranslation,
      });

      if (isHealthy) {
        return result;
      }

      throw new HealthCheckError('I18n service failed', result);
    } catch (error) {
      throw new HealthCheckError('I18n service failed', error);
    }
  }
}
