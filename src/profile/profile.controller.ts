import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/jwt/jwt.guard';
import { UserId } from 'auth/jwt/userid.decorator';
import { CreateProfileDTO } from './create-profile.dto';
import { ProfileNameValidationPipe } from './profile-name.pipe';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  public async createProfile(
    @Body() profileData: CreateProfileDTO,
    @UserId() userId: string,
  ) {
    await this.profileService.createProfile(profileData, userId);
  }

  @Get(':profile')
  public async getOneProfile(
    @Param('profile', ProfileNameValidationPipe) profileName: string,
  ) {
    const profile = await this.profileService.getProfileByName(profileName);

    return profile;
  }

  @Delete(':profile')
  @UseGuards(JwtAuthGuard)
  public async deleteOneProfile(
    @Param('profile', ProfileNameValidationPipe) profileName: string,
    @UserId() userId: string,
  ) {
    await this.profileService.deleteProfile(userId, profileName);

    return { message: 'The requested profile has been deleted' };
  }
}
