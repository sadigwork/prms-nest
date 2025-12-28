import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO للتحكم في التقسيم (Pagination) والترتيب (Sorting)
 * DTO for controlling pagination and sorting
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'رقم الصفحة (تبدأ من 1)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'عدد العناصر في الصفحة',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'بحث نصي',
    example: 'أحمد',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'حقل الترتيب',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'اتجاه الترتيب (ASC تصاعدي، DESC تنازلي)',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'فلترة حسب الحالة',
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'فلترة حسب الدور',
    example: 'APPLICANT',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'فلترة حسب النوع',
    example: 'ENGINEER',
  })
  @IsOptional()
  @IsString()
  type?: string;

  /**
   * حساب offset لاستخدامه في الاستعلامات
   * Calculate offset for use in queries
   */
  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  /**
   * إرجاع كائن الترتيب للاستخدام مع TypeORM
   * Return order object for use with TypeORM
   */
  get order(): Record<string, 'ASC' | 'DESC'> {
    return { [this.sortBy]: this.sortOrder };
  }
}
