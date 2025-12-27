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
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'ahmed@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({ example: 'Ahmed' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Mohamed' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '29801010123456' })
  @IsString()
  @Matches(/^\d{14}$/, { message: 'National ID must be 14 digits' })
  nationalId: string;

  @ApiProperty({ example: '+201234567890' })
  @IsString()
  @Matches(/^\+?\d{10,15}$/)
  phoneNumber: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty({ enum: UserRole, default: UserRole.APPLICANT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
