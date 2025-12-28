import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'ahmed@example.com',
    description: 'البريد الإلكتروني',
  })
  @IsEmail({}, { message: 'validation.email' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'كلمة المرور' })
  @IsString({ message: 'validation.required' })
  @MinLength(8, { message: 'validation.min_length' })
  @MaxLength(32, { message: 'validation.max_length' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'validation.password_strength',
  })
  password: string;

  @ApiProperty({ example: 'أحمد', description: 'الاسم الأول' })
  @IsString({ message: 'validation.required' })
  @MinLength(2, { message: 'validation.min_length' })
  @MaxLength(50, { message: 'validation.max_length' })
  firstName: string;

  @ApiProperty({ example: 'محمد', description: 'اسم العائلة' })
  @IsString({ message: 'validation.required' })
  @MinLength(2, { message: 'validation.min_length' })
  @MaxLength(50, { message: 'validation.max_length' })
  lastName: string;

  @ApiProperty({ example: '29801010123456', description: 'رقم الهوية الوطنية' })
  @IsString({ message: 'validation.required' })
  @Matches(/^\d{14}$/, { message: 'validation.national_id' })
  nationalId: string;

  @ApiProperty({ example: '+201234567890', description: 'رقم الهاتف' })
  @IsString({ message: 'validation.required' })
  @Matches(/^\+?\d{10,15}$/, { message: 'validation.phone_number' })
  phoneNumber: string;

  @ApiProperty({ example: '1990-01-01', description: 'تاريخ الميلاد' })
  @IsDateString({}, { message: 'validation.date_format' })
  dateOfBirth: Date;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.APPLICANT,
    description: 'الدور',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
