import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, UserStatus } from './enums/user.enum';
import { PaginationDto } from '../../core/common/dto/pagination.dto';
import { PaginatedResult } from '../../core/common/interfaces/paginated-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email exists
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if national ID exists
    const existingNationalId = await this.usersRepository.findOne({
      where: { nationalId: createUserDto.nationalId },
    });

    if (existingNationalId) {
      throw new ConflictException('National ID already exists');
    }

    try {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation
        throw new ConflictException('Duplicate entry found');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = paginationDto;

    const whereConditions: FindOptionsWhere<User> = {};

    if (search) {
      whereConditions.firstName = Like(`%${search}%`);
      // يمكن إضافة شروط بحث أخرى
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where: whereConditions,
      order: { [sortBy]: sortOrder },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['qualifications', 'experiences'],
    });

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['qualifications', 'experiences', 'publications'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findOne(id);
    user.status = status;
    return await this.usersRepository.save(user);
  }

  async calculateTotalExperience(userId: string): Promise<number> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['experiences'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let totalYears = 0;

    for (const experience of user.experiences) {
      if (experience.verified) {
        const startDate = new Date(experience.startDate);
        const endDate = experience.endDate
          ? new Date(experience.endDate)
          : new Date();
        const years =
          (endDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25);
        totalYears += years;
      }
    }

    user.totalExperienceYears = parseFloat(totalYears.toFixed(2));
    await this.usersRepository.save(user);

    return user.totalExperienceYears;
  }
}
