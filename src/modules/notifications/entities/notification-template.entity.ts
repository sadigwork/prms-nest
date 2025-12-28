import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  NotificationType,
  NotificationChannel,
} from '../enums/notification.enum';

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column()
  subject: string;

  @Column('text')
  content: string;

  @Column('jsonb')
  variables: string[];

  @Column({ default: 'ar' })
  defaultLanguage: string;

  @Column('jsonb')
  translations: Record<string, { subject: string; content: string }>;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
