import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './user-profile.entity';

@Module({
  providers: [ProfileService],
  imports: [TypeOrmModule.forFeature([UserProfile])],
  controllers: [ProfileController],
})
export class ProfileModule {}
