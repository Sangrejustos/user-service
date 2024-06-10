import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createMock } from '@golevelup/ts-jest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { UserDto } from 'src/dto/user.dto';
import { UsersPaginated } from 'src/dto/usersPaginated.dto';
import { PaginationDto } from 'src/dto/pagination.dto';

describe('UserController', () => {
  let controller: UserController;

  let mockUserService: UserService;
  let mockUser: UserDto;

  beforeAll(async () => {
    mockUser = {
      email: faker.internet.email(),
      login: faker.internet.userName(),
      password: faker.internet.password(),
      age: faker.number.int({ min: 14, max: 199 }),
      description: faker.lorem.sentence(),
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: createMock<UserService>({

            createUser: jest.fn(async (dto: UserDto) => {
              return Promise.resolve({
                ...dto,
                login: String(dto.login),
                id: 1
              })
            }),

            getAllUsers: jest.fn(async (query: PaginationDto): Promise<UsersPaginated> => {
              return Promise.resolve({
                users: [{ ...mockUser, login: String(mockUser.login), id: 1 }],
                page: 1,
                pagesAmount: 1,
              })
            })

          }),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockUserService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    it('should call create method of UserService', async () => {
      expect(await controller.create(mockUser)).toEqual({ ...mockUser, id: expect.any(Number) });

      expect(mockUserService.createUser).toHaveBeenCalled();

    })
  })

  describe('get All', () => {
    it('should call getAllUsers method of UserService with the query', async () => {
      const query: PaginationDto = { perPage: '1', page: '1' };
      const result = {
        users: [{ ...mockUser, login: String(mockUser.login), id: 1 }],
        page: 1,
        pagesAmount: 1,
      };

      expect(await controller.getAll(query)).toEqual(result);
      expect(mockUserService.getAllUsers).toHaveBeenCalledWith(query);
    });
  });

});
