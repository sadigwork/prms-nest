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
import { ExperienceType, EmploymentType } from '../enums/publication.enum';

@Entity('publications')
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
