import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from 'src/database/database.service';
import { UsersRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dto/user.dto';
import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { User } from '@prisma/client';
import { PaginationDto } from 'src/dto/pagination.dto';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepo: UsersRepository;

  let mockUserId: string;
  let mockUser: UserDto;
  let email: string;
  let mockPaginationDto: PaginationDto;

  beforeAll(async () => {
    mockUserId = '1';
    email = faker.internet.email()
    mockUser = {
      email,
      login: faker.internet.userName(),
      password: faker.internet.password(),
      age: faker.number.int({ min: 14, max: 199 }),
      description: faker.lorem.sentence(),
    };

    mockPaginationDto = {
      perPage: '10',
      page: '1',
    }

  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: UsersRepository,
          useValue: createMock<UsersRepository>({

            createUser: jest.fn(async (dto: UserDto): Promise<User> => {
              return Promise.resolve({
                id: 1,
                ...dto,
                login: String(dto.login),
              })
            }),

            countUsers: jest.fn(async (email: string) => {
              return 1;
            }),

            findAllUsersPaginated: jest.fn(async (skip: number, take: number, email: string) => {
              return Promise.resolve([{ ...mockUser, id: 1, login: String(mockUser.login) }]);
            })

          })
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        }
      ],
    }).compile();


    service = module.get<UserService>(UserService);
    mockUserRepo = module.get<UsersRepository>(UsersRepository);
  });

  describe('create user', () => {

    it('should call createUser method of UsersRepository', async () => {

      expect(await service.createUser(mockUser)).toEqual({ ...mockUser, id: expect.any(Number) });

      expect(mockUserRepo.createUser).toHaveBeenCalled();

    })

  });

  describe('get all users', () => {

    it('should call getAllUsers and return UsersPaginated', async () => {
      expect(await service.getAllUsers(mockPaginationDto)).toEqual({
        users: [{ ...mockUser, id: 1 }],
        page: +mockPaginationDto.page,
        pagesAmount: 1
      })

      expect(mockUserRepo.countUsers).toHaveBeenCalled();
      expect(mockUserRepo.findAllUsersPaginated).toHaveBeenCalled();

      await expect(service.getAllUsers({ page: '0', perPage: '0' })).rejects.toThrow(BadRequestException);
    })

  })



});
