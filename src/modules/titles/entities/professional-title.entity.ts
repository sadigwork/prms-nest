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
import { TitleLevel, TitleStatus } from '../enums/title.enum';

@Entity('professional_titles')
export class ProfessionalTitle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TitleLevel })
  level: TitleLevel;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: TitleStatus, default: TitleStatus.PENDING })
  status: TitleStatus;

  @Column({ type: 'jsonb', nullable: true })
  criteria: {
    minExperienceYears: number;
    minEducationLevel: string;
    requiredPublications?: number;
    requiredTrainings?: string[];
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  evaluationResult: {
    meetsCriteria: boolean;
    score: number;
    breakdown: {
      experience: { value: number; required: number; passed: boolean };
      education: { value: string; required: string; passed: boolean };
      publications: { value: number; required: number; passed: boolean };
      [key: string]: any;
    };
  };

  @Column({ type: 'date', nullable: true })
  awardedDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  certificateNumber: string;

  @Column({ nullable: true })
  awardedBy: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
