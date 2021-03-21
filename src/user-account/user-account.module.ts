import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './user-account.entity';
import { UserAccountService } from './user-account.service';

@Module({
  providers: [UserAccountService],
  imports: [TypeOrmModule.forFeature([UserAccount])],
  exports: [UserAccountService],
})
export class UserAccountModule {}
