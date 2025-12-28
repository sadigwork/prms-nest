import { Module, Global } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { TranslationLoader } from './translation.loader';

@Global()
@Module({
  providers: [I18nService, TranslationLoader],
  exports: [I18nService],
})
export class I18nModule {}
