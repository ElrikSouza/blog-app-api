import { Module } from '@nestjs/common';
import { CrpytModule } from 'crpyt/crpyt.module';
import { UserAccountModule } from 'user-account/user-account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envVars } from 'env';

@Module({
  providers: [AuthService],
  imports: [
    UserAccountModule,
    CrpytModule,
    JwtModule.register({
      secret: envVars.JWT_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
