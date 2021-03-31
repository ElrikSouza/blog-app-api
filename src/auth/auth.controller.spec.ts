import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CrpytModule } from 'crpyt/crpyt.module';
import { UserAccount } from 'user-account/user-account.entity';
import { mockUserAccountRepo } from 'user-account/user-account.mock';
import { UserAccountService } from 'user-account/user-account.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserAccountService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUserAccountRepo,
        },
      ],
      imports: [JwtModule.register({ secret: 'test' }), CrpytModule],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
