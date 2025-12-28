import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from '../enums/notification.enum';

@Entity('notifications')
@Index(['userId', 'status'])
@Index(['userId', 'createdAt'])
@Index(['type', 'status'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column('jsonb', { nullable: true })
  data: Record<string, any>;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ default: false })
  sent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  error: string;

  @Column('jsonb', { nullable: true })
  metadata: {
    retryCount: number;
    providerResponse?: any;
    templateId?: string;
    language: string;
  };

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledFor: Date;
}
