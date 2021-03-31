import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CrpytService } from 'crpyt/crpyt.service';
import { UserAccountService } from 'user-account/user-account.service';
import { AuthDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private crypt: CrpytService,
    private userAccountService: UserAccountService,
    private jwtService: JwtService,
  ) {}

  private async getUserAccountIfCredentialsMatch(userInfo: AuthDTO) {
    const userAccount = await this.userAccountService.getUserAccountOrFail(
      userInfo.email,
    );

    const doPasswordsMatch = await this.crypt.compareAsync(
      userInfo.password,
      userAccount.password,
    );

    if (!doPasswordsMatch) {
      throw new UnauthorizedException('Wrong password.');
    }

    return userAccount;
  }

  public async issueToken(id: string) {
    return this.jwtService.signAsync({ userAccountId: id });
  }

  public async logIn(userInfo: AuthDTO) {
    const userAccount = await this.getUserAccountIfCredentialsMatch(userInfo);
    return this.issueToken(userAccount.id);
  }

  public async signUp(userInfo: AuthDTO) {
    const isEmailAlreadyInUse = await this.userAccountService.isEmailAlreadyTaken(
      userInfo.email,
    );

    if (isEmailAlreadyInUse) {
      throw new ConflictException('Email already in use.');
    }

    const hashedPassword = await this.crypt.hashAsync(userInfo.password);

    await this.userAccountService.addUserAccount({
      email: userInfo.email,
      password: hashedPassword,
    });
  }
}
