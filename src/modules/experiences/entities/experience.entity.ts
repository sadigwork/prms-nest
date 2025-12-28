import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  ExperienceType,
  EmploymentType,
  ExperienceLevel,
  ExperienceField,
  VerificationStatus,
} from '../enums/experience.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('professional_experiences')
export class ProfessionalExperience {
  @ApiProperty({
    description: 'المعرف الفريد للخبرة',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'اسم المؤسسة أو الشركة',
    example: 'وزارة الزراعة',
  })
  @Column({ nullable: false })
  organization: string;

  @ApiProperty({
    description: 'المسمى الوظيفي',
    example: 'مهندس زراعي',
  })
  @Column({ nullable: false })
  position: string;

  @ApiProperty({
    description: 'نوع الخبرة',
    example: ExperienceType.GOVERNMENT,
    enum: ExperienceType,
  })
  @Column({
    type: 'enum',
    enum: ExperienceType,
    nullable: false,
  })
  type: ExperienceType;

  @ApiProperty({
    description: 'نوع التوظيف',
    example: EmploymentType.FULL_TIME,
    enum: EmploymentType,
  })
  @Column({
    type: 'enum',
    enum: EmploymentType,
    nullable: false,
  })
  employmentType: EmploymentType;

  @ApiProperty({
    description: 'مستوى الخبرة',
    example: ExperienceLevel.MID,
    enum: ExperienceLevel,
  })
  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    nullable: false,
  })
  level: ExperienceLevel;

  @ApiProperty({
    description: 'مجال الخبرة',
    example: ExperienceField.AGRICULTURAL_ENGINEERING,
    enum: ExperienceField,
  })
  @Column({
    type: 'enum',
    enum: ExperienceField,
    nullable: false,
  })
  field: ExperienceField;

  @ApiProperty({
    description: 'تاريخ البدء',
    example: '2019-01-01',
  })
  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @ApiProperty({
    description: 'تاريخ الانتهاء',
    example: '2023-12-31',
  })
  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ApiProperty({
    description: 'هل هذه الوظيفة الحالية؟',
    example: false,
    default: false,
  })
  @Column({ default: false })
  isCurrent: boolean;

  @ApiProperty({
    description: 'وصف المهام والمسؤوليات',
    example: 'تخطيط وتنفيذ مشاريع الري الحديثة',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'المهارات المكتسبة',
    example: ['إدارة المشاريع', 'تخطيط الري', 'تحليل التربة'],
    type: [String],
  })
  @Column('simple-array', { nullable: true })
  skills: string[];

  @ApiProperty({
    description: 'المشاريع الرئيسية',
    example: ['مشروع تحديث أنظمة الري', 'مشروع تحسين إنتاجية المحاصيل'],
    type: [String],
  })
  @Column('simple-array', { nullable: true })
  keyProjects: string[];

  @ApiProperty({
    description: 'الإنجازات',
    example: ['زيادة الإنتاجية بنسبة 30%', 'تخفيض استهلاك المياه بنسبة 25%'],
    type: [String],
  })
  @Column('simple-array', { nullable: true })
  achievements: string[];

  @ApiProperty({
    description: 'حالة التحقق',
    example: VerificationStatus.PENDING,
    enum: VerificationStatus,
    default: VerificationStatus.UNCONFIRMED,
  })
  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.UNCONFIRMED,
  })
  verificationStatus: VerificationStatus;

  @ApiProperty({
    description: 'تم التحقق بواسطة (معرف المستخدم)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ nullable: true })
  verifiedBy: string;

  @ApiProperty({
    description: 'تاريخ التحقق',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @ApiProperty({
    description: 'رابط مرفق خطاب التعيين',
    example: 'https://storage.example.com/appointment-letters/123.pdf',
  })
  @Column({ nullable: true })
  appointmentLetterUrl: string;

  @ApiProperty({
    description: 'رابط مرفق شهادة الخبرة',
    example: 'https://storage.example.com/experience-certificates/123.pdf',
  })
  @Column({ nullable: true })
  experienceCertificateUrl: string;

  @ApiProperty({
    description: 'البلد',
    example: 'مصر',
  })
  @Column({ nullable: true })
  country: string;

  @ApiProperty({
    description: 'المدينة',
    example: 'القاهرة',
  })
  @Column({ nullable: true })
  city: string;

  @ApiProperty({
    description: 'رقم الهاتف للتحقق',
    example: '+201234567890',
  })
  @Column({ nullable: true })
  verificationPhone: string;

  @ApiProperty({
    description: 'البريد الإلكتروني للتحقق',
    example: 'hr@company.com',
  })
  @Column({ nullable: true })
  verificationEmail: string;

  @ApiProperty({
    description: 'ملاحظات إضافية',
    example: 'يمكن التواصل مع مدير الموارد البشرية للتحقق',
  })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({
    description: 'المستخدم صاحب الخبرة',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.experiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'معرف المستخدم',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  userId: string;

  @ApiProperty({
    description: 'تاريخ الإنشاء',
    example: '2024-01-01T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'تاريخ آخر تحديث',
    example: '2024-01-02T15:45:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateExperience() {
    // التحقق من أن تاريخ البدء قبل تاريخ الانتهاء
    // Verify that start date is before end date
    if (this.endDate && this.startDate > this.endDate) {
      throw new Error('تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء');
    }

    // إذا كانت الوظيفة حالية، يجب أن يكون تاريخ الانتهاء فارغاً
    // If job is current, end date should be null
    if (this.isCurrent && this.endDate) {
      this.endDate = null;
    }
  }

  /**
   * حساب سنوات الخبرة
   * Calculate years of experience
   */
  getYearsOfExperience(): number {
    const start = new Date(this.startDate);
    const end = this.isCurrent ? new Date() : new Date(this.endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

    return parseFloat(diffYears.toFixed(2));
  }

  /**
   * التحقق من صحة الخبرة
   * Verify experience validity
   */
  isValid(): boolean {
    return this.verificationStatus === VerificationStatus.VERIFIED;
  }

  /**
   * الحصول على وصف الخبرة
   * Get experience description
   */
  getDescription(): string {
    return `${this.position} في ${this.organization} (${this.startDate.getFullYear()} - ${this.isCurrent ? 'حالياً' : this.endDate.getFullYear()})`;
  }

  /**
   * التحقق مما إذا كانت الخبرة طويلة المدى (أكثر من 3 سنوات)
   * Check if experience is long-term (more than 3 years)
   */
  isLongTerm(): boolean {
    return this.getYearsOfExperience() >= 3;
  }
}
