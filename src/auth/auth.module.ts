import { Module } from '@nestjs/common';
import { CrpytModule } from 'src/crpyt/crpyt.module';
import { UserAccountModule } from 'src/user-account/user-account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  imports: [UserAccountModule, CrpytModule],
  controllers: [AuthController],
})
export class AuthModule {}
