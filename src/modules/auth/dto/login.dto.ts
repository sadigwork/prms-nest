import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO لتسجيل الدخول
 * DTO for login
 */
export class LoginDto {
  @ApiProperty({
    description: 'البريد الإلكتروني',
    example: 'ahmed@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'يجب أن يكون بريد إلكتروني صحيح' })
  email: string;

  @ApiProperty({
    description: 'كلمة المرور',
    example: 'Password123!',
    required: true,
  })
  @IsString({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @MaxLength(32, { message: 'كلمة المرور يجب ألا تتجاوز 32 حرف' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم أو رمز',
  })
  password: string;

  @ApiProperty({
    description: 'تذكرني (للحفاظ على تسجيل الدخول)',
    example: false,
    required: false,
  })
  rememberMe?: boolean = false;
}
