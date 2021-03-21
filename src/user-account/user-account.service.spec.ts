import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from './user-account.entity';
import { UserAccountService } from './user-account.service';

describe('UserAccountService', () => {
  let service: UserAccountService;
  const accounts = [
    { email: 'email1@example.com', password: 'A password' },
    { email: 'email2@example.com', password: 'A password' },
  ];
  const mockRepository = {
    async count({ email }: { email: string }) {
      const count = accounts.filter((account) => account.email === email)
        .length;

      return count;
    },
    async findOne({ email }: { email: string }) {
      const result = accounts.find((account) => account.email === email);

      return result;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAccountService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockRepository,
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
      const result = await service.isEmailAlreadyTaken('email1@example.com');
      expect(result).toBe(true);
    });

    it('should return false if the email is not in use', async () => {
      const result = await service.isEmailAlreadyTaken('email3@example.com');
      expect(result).toBe(false);
    });
  });

  describe('getUserAccountOrFail', () => {
    it('should return the requested account if it exists', async () => {
      const result = await service.getUserAccountOrFail('email1@example.com');

      expect(result).toEqual(accounts[0]);
    });

    it('should throw an exception if the requested account does not exist', () => {
      const result = service.getUserAccountOrFail('email3@example.com');

      expect(result).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
