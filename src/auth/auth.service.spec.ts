import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';
import { UserDto } from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UsersRepository } from 'src/user/user.repository';
import { DatabaseService } from 'src/database/database.service';
import { AuthModule } from './auth.module';

describe('AuthService', () => {
  let service: AuthService;

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
      imports: [AuthModule],
      providers: [AuthService, UserService, UsersRepository, DatabaseService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(('method registrates user'), () => {

    it('should registrate user and return token', async () => {
      expect(await service.registrate(mockUser)).toEqual({
        token: expect.any(String),
      });
    })

  });

  describe(('method authenticates user'), () => {

    it('should authenticate user and return token', async () => {
      expect(await service.login({ email: mockUser.email, password: mockUser.password })).toEqual({
        token: expect.any(String),
      });
    })

  })

});
