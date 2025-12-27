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
