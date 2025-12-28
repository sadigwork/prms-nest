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
  PublicationType,
  PublicationStatus,
  JournalLevel,
  AuthorRole,
  ResearchField,
} from '../enums/publication.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('publications')
export class Publication {
  @ApiProperty({
    description: 'المعرف الفريد للمنشور',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'نوع المنشور',
    example: PublicationType.JOURNAL_ARTICLE,
    enum: PublicationType,
  })
  @Column({
    type: 'enum',
    enum: PublicationType,
    nullable: false,
  })
  type: PublicationType;

  @ApiProperty({
    description: 'عنوان المنشور',
    example: 'تأثير أنظمة الري الحديثة على إنتاجية القمح في مصر',
  })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({
    description: 'ملخص المنشور',
    example: 'دراسة تأثير أنظمة الري بالتنقيط والرش على إنتاجية محصول القمح...',
  })
  @Column({ type: 'text', nullable: true })
  abstract: string;

  @ApiProperty({
    description: 'مجلة النشر',
    example: 'المجلة المصرية للهندسة الزراعية',
  })
  @Column({ nullable: true })
  journal: string;

  @ApiProperty({
    description: 'مستوى المجلة',
    example: JournalLevel.ARAB,
    enum: JournalLevel,
  })
  @Column({
    type: 'enum',
    enum: JournalLevel,
    nullable: true,
  })
  journalLevel: JournalLevel;

  @ApiProperty({
    description: 'المجلد',
    example: 45,
  })
  @Column({ nullable: true })
  volume: number;

  @ApiProperty({
    description: 'العدد',
    example: 3,
  })
  @Column({ nullable: true })
  issue: number;

  @ApiProperty({
    description: 'الصفحات',
    example: '123-135',
  })
  @Column({ nullable: true })
  pages: string;

  @ApiProperty({
    description: 'سنة النشر',
    example: 2023,
  })
  @Column({ nullable: false })
  year: number;

  @ApiProperty({
    description: 'شهر النشر',
    example: 6,
  })
  @Column({ nullable: true })
  month: number;

  @ApiProperty({
    description: 'DOI (معرف رقمي للمنشور)',
    example: '10.1234/abcdef',
  })
  @Column({ nullable: true, unique: true })
  doi: string;

  @ApiProperty({
    description: 'ISBN (للكتب)',
    example: '978-3-16-148410-0',
  })
  @Column({ nullable: true })
  isbn: string;

  @ApiProperty({
    description: 'ISSN (للمجلات)',
    example: '1234-5678',
  })
  @Column({ nullable: true })
  issn: string;

  @ApiProperty({
    description: 'رابط المنشور',
    example: 'https://www.example.com/article',
  })
  @Column({ nullable: true })
  url: string;

  @ApiProperty({
    description: 'المؤلفون (كقائمة نصية)',
    example: 'أحمد محمد، محمود علي، سارة خالد',
  })
  @Column({ nullable: false })
  authors: string;

  @ApiProperty({
    description: 'دور المؤلف في البحث',
    example: AuthorRole.MAIN_AUTHOR,
    enum: AuthorRole,
  })
  @Column({
    type: 'enum',
    enum: AuthorRole,
    nullable: false,
  })
  authorRole: AuthorRole;

  @ApiProperty({
    description: 'حالة النشر',
    example: PublicationStatus.PUBLISHED,
    enum: PublicationStatus,
    default: PublicationStatus.PUBLISHED,
  })
  @Column({
    type: 'enum',
    enum: PublicationStatus,
    default: PublicationStatus.PUBLISHED,
  })
  status: PublicationStatus;

  @ApiProperty({
    description: 'مجال البحث',
    example: ResearchField.AGRICULTURAL_ENGINEERING,
    enum: ResearchField,
  })
  @Column({
    type: 'enum',
    enum: ResearchField,
    nullable: false,
  })
  researchField: ResearchField;

  @ApiProperty({
    description: 'الكلمات المفتاحية',
    example: ['الري', 'القمح', 'الإنتاجية', 'مصر'],
    type: [String],
  })
  @Column('simple-array', { nullable: true })
  keywords: string[];

  @ApiProperty({
    description: 'رابط مرفق المنشور',
    example: 'https://storage.example.com/publications/123.pdf',
  })
  @Column({ nullable: true })
  attachmentUrl: string;

  @ApiProperty({
    description: 'تم التحقق منه',
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
    description: 'معامل التأثير (Impact Factor)',
    example: 3.5,
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  impactFactor: number;

  @ApiProperty({
    description: 'عدد الاستشهادات',
    example: 25,
  })
  @Column({ default: 0 })
  citations: number;

  @ApiProperty({
    description: 'ملاحظات إضافية',
    example: 'نشر في مؤتمر دولي',
  })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({
    description: 'المستخدم صاحب المنشور',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.publications, {
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
  validatePublication() {
    // التحقق من صحة السنة
    // Validate year
    const currentYear = new Date().getFullYear();
    if (this.year < 1900 || this.year > currentYear + 1) {
      throw new Error('سنة النشر غير صالحة');
    }

    // التحقق من صحة الشهر
    // Validate month
    if (this.month && (this.month < 1 || this.month > 12)) {
      throw new Error('شهر النشر غير صالح');
    }

    // التحقق من أن DOI فريد إذا كان موجوداً
    // Verify that DOI is unique if it exists
    if (this.doi && !this.doi.startsWith('10.')) {
      throw new Error('تنسيق DOI غير صحيح، يجب أن يبدأ بـ 10.');
    }
  }

  /**
   * الحصول على الاقتباس الكامل
   * Get full citation
   */
  getCitation(): string {
    let citation = `${this.authors} (${this.year}). "${this.title}".`;

    if (this.journal) {
      citation += ` ${this.journal}`;
      if (this.volume) citation += `, ${this.volume}`;
      if (this.issue) citation += `(${this.issue})`;
      if (this.pages) citation += `, ${this.pages}`;
      citation += '.';
    }

    if (this.doi) {
      citation += ` https://doi.org/${this.doi}`;
    }

    return citation;
  }

  /**
   * التحقق مما إذا كان المنشور في مجلة محكمة
   * Check if publication is in a refereed journal
   */
  isRefereedJournal(): boolean {
    return (
      this.type === PublicationType.JOURNAL_ARTICLE &&
      this.journalLevel !== JournalLevel.LOCAL
    );
  }

  /**
   * الحصول على مؤشر الجودة بناءً على مستوى المجلة
   * Get quality index based on journal level
   */
  getQualityIndex(): number {
    const qualityMap = {
      [JournalLevel.LOCAL]: 1,
      [JournalLevel.ARAB]: 2,
      [JournalLevel.INTERNATIONAL]: 3,
      [JournalLevel.SCOPUS]: 4,
      [JournalLevel.CLARIVATE]: 5,
    };

    return qualityMap[this.journalLevel] || 0;
  }

  /**
   * الحصول على وصف المنشور
   * Get publication description
   */
  getDescription(): string {
    return `${this.title} (${this.year}) - ${this.journal || this.type}`;
  }
}
