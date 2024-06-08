import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from 'src/database/database.service';
import { UsersRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dto/user.dto';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let service: UserService;

  let mockUserId: string;
  let mockUser: UserDto;
  let email: string;

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
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, DatabaseService, UsersRepository, JwtService],
    }).compile();


    service = module.get<UserService>(UserService);
  });

  describe('method create', () => {

    it('should create user', async () => {

      expect(await service.createUser(mockUser)).toEqual({ ...mockUser, id: expect.any(Number) });

    })

  });
});
