import { Module } from '@nestjs/common';
import { CrpytModule } from 'src/crpyt/crpyt.module';
import { UserAccountModule } from 'src/user-account/user-account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envVars } from 'src/env';

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
