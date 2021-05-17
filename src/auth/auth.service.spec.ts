import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CrpytModule } from 'crpyt/crpyt.module';
import { UserAccount } from 'user-account/user-account.entity';
import {
  mockUserAccountRepo,
  createMockUserAccounts,
} from 'user-account/user-account.mock';
import { UserAccountService } from 'user-account/user-account.service';
import { AuthService } from './auth.service';
import * as faker from 'faker';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  const mockUserAccounts = createMockUserAccounts(3);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserAccountService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUserAccountRepo(mockUserAccounts),
        },
      ],
      imports: [JwtModule.register({ secret: 'test' }), CrpytModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logIn', () => {
    it('should fail if the password is wrong', () => {
      const rejectedPromise = service.logIn({
        email: mockUserAccounts[0].email,
        password: faker.datatype.string(12),
      });

      expect(rejectedPromise).rejects.toThrowError(UnauthorizedException);
    });

    it('should fail if the requested account does not exist', () => {
      const rejectedPromise = service.logIn({
        email: faker.internet.email(),
        password: faker.datatype.string(12),
      });

      expect(rejectedPromise).rejects.toThrowError(UnauthorizedException);
    });

    it('should succeed if the credentials are correct', async () => {
      const result = await service.logIn({
        ...mockUserAccounts[0],
        password: '12345678',
      });

      const { userAccountId } = jwt.decode(result) as { userAccountId: string };
      expect(userAccountId).toBe(mockUserAccounts[0].id);
    });
  });

  describe('signUp', () => {
    it('should fail if the provided email is already in use', () => {
      const result = service.signUp(mockUserAccounts[0]);

      expect(result).rejects.toThrowError(BadRequestException);
    });

    it('should succeed if the email is available', () => {
      expect(async () =>
        service.signUp({
          email: faker.internet.email(),
          password: faker.datatype.string(12),
        }),
      ).not.toThrow();
    });
  });
});
