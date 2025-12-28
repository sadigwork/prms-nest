import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../src/modules/users/users.service';
import { User } from '../../src/modules/users/entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: Partial<User> = {
    id: 'uuid',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    nationalId: '12345678901234',
    phoneNumber: '+1234567890',
    dateOfBirth: new Date('1990-01-01'),
    role: 'APPLICANT',
    status: 'PENDING',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        nationalId: '12345678901235',
        phoneNumber: '+1234567891',
        dateOfBirth: new Date('1990-01-01'),
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createUserDto);
      mockRepository.save.mockResolvedValue({ ...createUserDto, id: 'uuid' });

      const result = await service.create(createUserDto);

      expect(result).toHaveProperty('id');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException for duplicate email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Jane',
          lastName: 'Doe',
          nationalId: '12345678901236',
          phoneNumber: '+1234567892',
          dateOfBirth: new Date('1990-01-01'),
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['qualifications', 'experiences', 'publications'],
      });
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
