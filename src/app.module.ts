import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserAccountModule } from './user-account/user-account.module';

@Module({
  imports: [UserAccountModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
