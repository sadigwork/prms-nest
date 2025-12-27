import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole, UserStatus } from '../enums/user.enum';
import { Qualification } from '../../qualifications/entities/qualification.entity';
import { ProfessionalExperience } from '../../experiences/entities/experience.entity';
import { Publication } from '../../publications/entities/publication.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  nationalId: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.APPLICANT })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ nullable: true })
  professionalLicenseNumber: string;

  @Column({ type: 'date', nullable: true })
  licenseIssueDate: Date;

  @Column({ type: 'date', nullable: true })
  licenseExpiryDate: Date;

  @Column({ default: 0 })
  totalExperienceYears: number;

  @OneToMany(() => Qualification, (qualification) => qualification.user)
  qualifications: Qualification[];

  @OneToMany(() => ProfessionalExperience, (experience) => experience.user)
  experiences: ProfessionalExperience[];

  @OneToMany(() => Publication, (publication) => publication.user)
  publications: Publication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword?() {
    if (this.password) {
      const bcrypt = require('bcrypt');
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(password, this.password);
  }
}
