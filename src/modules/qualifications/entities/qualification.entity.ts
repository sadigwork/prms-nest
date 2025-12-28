import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { QualificationType, EducationLevel } from '../enums/qualification.enum';

@Entity('qualifications')
export class Qualification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: QualificationType })
  type: QualificationType;

  @Column({ type: 'enum', enum: EducationLevel })
  educationLevel: EducationLevel;

  @Column()
  institution: string;

  @Column()
  fieldOfStudy: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  certificateNumber: string;

  @Column({ nullable: true })
  attachmentUrl: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  verifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => User, (user) => user.qualifications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
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
  QualificationType,
  EducationLevel,
  QualificationStatus,
  StudySystem,
  GraduationGrade,
} from '../enums/qualification.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('qualifications')
export class Qualification {
  @ApiProperty({
    description: 'المعرف الفريد للمؤهل',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'نوع المؤهل',
    example: QualificationType.BACHELOR,
    enum: QualificationType,
  })
  @Column({
    type: 'enum',
    enum: QualificationType,
    nullable: false,
  })
  type: QualificationType;

  @ApiProperty({
    description: 'المستوى التعليمي',
    example: EducationLevel.BACHELOR,
    enum: EducationLevel,
  })
  @Column({
    type: 'enum',
    enum: EducationLevel,
    nullable: false,
  })
  educationLevel: EducationLevel;

  @ApiProperty({
    description: 'اسم المؤسسة التعليمية',
    example: 'جامعة القاهرة',
  })
  @Column({ nullable: false })
  institution: string;

  @ApiProperty({
    description: 'التخصص',
    example: 'الهندسة الزراعية',
  })
  @Column({ nullable: false })
  fieldOfStudy: string;

  @ApiProperty({
    description: 'تاريخ البدء',
    example: '2015-09-01',
  })
  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @ApiProperty({
    description: 'تاريخ الانتهاء',
    example: '2019-06-30',
  })
  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ApiProperty({
    description: 'تقدير التخرج',
    example: GraduationGrade.VERY_GOOD,
    enum: GraduationGrade,
  })
  @Column({
    type: 'enum',
    enum: GraduationGrade,
    nullable: true,
  })
  grade: GraduationGrade;

  @ApiProperty({
    description: 'النسبة المئوية أو المعدل التراكمي',
    example: 85.5,
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @ApiProperty({
    description: 'نظام الدراسة',
    example: StudySystem.REGULAR,
    enum: StudySystem,
  })
  @Column({
    type: 'enum',
    enum: StudySystem,
    default: StudySystem.REGULAR,
  })
  studySystem: StudySystem;

  @ApiProperty({
    description: 'رقم الشهادة',
    example: 'CER-2020-12345',
  })
  @Column({ nullable: true, unique: true })
  certificateNumber: string;

  @ApiProperty({
    description: 'رابط مرفق الشهادة',
    example: 'https://storage.example.com/certificates/123.pdf',
  })
  @Column({ nullable: true })
  attachmentUrl: string;

  @ApiProperty({
    description: 'حالة التحقق',
    example: false,
    default: false,
  })
  @Column({ default: false })
  verified: boolean;

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
    description: 'حالة المؤهل',
    example: QualificationStatus.COMPLETED,
    enum: QualificationStatus,
    default: QualificationStatus.COMPLETED,
  })
  @Column({
    type: 'enum',
    enum: QualificationStatus,
    default: QualificationStatus.COMPLETED,
  })
  status: QualificationStatus;

  @ApiProperty({
    description: 'ملاحظات إضافية',
    example: 'تمت الدراسة باللغة الإنجليزية',
  })
  @Column({ type: 'text', nullable: true })
  notes: string;

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
    description: 'المستخدم صاحب المؤهل',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.qualifications, {
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
  validateDates() {
    if (this.endDate && this.startDate > this.endDate) {
      throw new Error('تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء');
    }
  }

  /**
   * حساب مدة الدراسة بالسنوات
   * Calculate study duration in years
   */
  getDurationInYears(): number {
    const start = new Date(this.startDate);
    const end = this.endDate ? new Date(this.endDate) : new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

    return parseFloat(diffYears.toFixed(2));
  }

  /**
   * التحقق مما إذا كان المؤهل مكتملاً
   * Check if qualification is completed
   */
  isCompleted(): boolean {
    return (
      this.status === QualificationStatus.COMPLETED && this.endDate !== null
    );
  }

  /**
   * الحصول على وصف المؤهل
   * Get qualification description
   */
  getDescription(): string {
    return `${this.educationLevel} في ${this.fieldOfStudy} من ${this.institution}`;
  }
}
