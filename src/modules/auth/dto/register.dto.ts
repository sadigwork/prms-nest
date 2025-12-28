import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../users/enums/user.enum';

/**
 * DTO لتسجيل مستخدم جديد
 * DTO for registering a new user
 */
export class RegisterDto {
  @ApiProperty({
    description: 'البريد الإلكتروني',
    example: 'ahmed@example.com',
  })
  @IsEmail({}, { message: 'يجب أن يكون بريد إلكتروني صحيح' })
  email: string;

  @ApiProperty({
    description: 'كلمة المرور',
    example: 'Password123!',
  })
  @IsString({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @MaxLength(32, { message: 'كلمة المرور يجب ألا تتجاوز 32 حرف' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم أو رمز',
  })
  password: string;

  @ApiProperty({
    description: 'تأكيد كلمة المرور',
    example: 'Password123!',
  })
  @IsString({ message: 'تأكيد كلمة المرور مطلوب' })
  confirmPassword: string;

  @ApiProperty({
    description: 'الاسم الأول',
    example: 'أحمد',
  })
  @IsString({ message: 'الاسم الأول مطلوب' })
  @MinLength(2, { message: 'الاسم الأول يجب أن يكون حرفين على الأقل' })
  @MaxLength(50, { message: 'الاسم الأول يجب ألا يتجاوز 50 حرف' })
  firstName: string;

  @ApiProperty({
    description: 'اسم العائلة',
    example: 'محمد',
  })
  @IsString({ message: 'اسم العائلة مطلوب' })
  @MinLength(2, { message: 'اسم العائلة يجب أن يكون حرفين على الأقل' })
  @MaxLength(50, { message: 'اسم العائلة يجب ألا يتجاوز 50 حرف' })
  lastName: string;

  @ApiProperty({
    description: 'رقم الهوية الوطنية',
    example: '29801010123456',
  })
  @IsString({ message: 'رقم الهوية الوطنية مطلوب' })
  @Matches(/^\d{14}$/, { message: 'رقم الهوية الوطنية يجب أن يكون 14 رقماً' })
  nationalId: string;

  @ApiProperty({
    description: 'رقم الهاتف',
    example: '+201234567890',
  })
  @IsString({ message: 'رقم الهاتف مطلوب' })
  @Matches(/^\+?\d{10,15}$/, { message: 'رقم الهاتف غير صحيح' })
  phoneNumber: string;

  @ApiProperty({
    description: 'تاريخ الميلاد',
    example: '1990-01-01',
  })
  @IsDateString({}, { message: 'تاريخ الميلاد غير صحيح' })
  dateOfBirth: Date;

  @ApiPropertyOptional({
    description: 'الدور (اختياري - الافتراضي APPLICANT)',
    example: UserRole.APPLICANT,
    enum: UserRole,
    default: UserRole.APPLICANT,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.APPLICANT;
}
