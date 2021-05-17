import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from './user-account.entity';
import {
  mockUserAccountRepo,
  createMockUserAccounts,
} from './user-account.mock';
import { UserAccountService } from './user-account.service';
import * as faker from 'faker';

describe('UserAccountService', () => {
  let service: UserAccountService;
  const mockUserAccounts = createMockUserAccounts(4);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAccountService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUserAccountRepo(mockUserAccounts),
        },
      ],
    }).compile();

    service = module.get<UserAccountService>(UserAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isEmailAlreadyTaken', () => {
    it('should return true if the email is already in use', async () => {
      const { email } = mockUserAccounts[0];
      const result = await service.isEmailAlreadyTaken(email);
      expect(result).toBe(true);
    });

    it('should return false if the email is not in use', async () => {
      const email = faker.internet.email();
      const result = await service.isEmailAlreadyTaken(email);
      expect(result).toBe(false);
    });
  });

  describe('getUserAccountOrFail', () => {
    it('should return the requested account if it exists', async () => {
      const { email } = mockUserAccounts[0];
      const result = await service.getUserAccountOrFail(email);

      expect(result).toEqual(mockUserAccounts[0]);
    });

    it('should throw an exception if the requested account does not exist', () => {
      const email = faker.internet.email();
      const result = service.getUserAccountOrFail(email);

      expect(result).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
