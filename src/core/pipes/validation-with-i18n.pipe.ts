import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { I18nService } from '../../modules/i18n/i18n.service';

@Injectable()
export class ValidationWithI18nPipe implements PipeTransform<any> {
  constructor(private i18nService: I18nService) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const translatedErrors = this.translateErrors(errors);
      throw new BadRequestException(translatedErrors);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private translateErrors(errors: any[], language: string = 'ar'): any[] {
    return errors.map((error) => {
      const constraints = {};

      if (error.constraints) {
        for (const [key, message] of Object.entries(error.constraints)) {
          constraints[key] = this.i18nService.translate(
            `validation.${key}`,
            language,
            { count: (error as any).min || (error as any).max },
          );
        }
      }

      if (error.children && error.children.length > 0) {
        error.children = this.translateErrors(error.children, language);
      }

      return {
        property: error.property,
        constraints,
        value: error.value,
      };
    });
  }
}
