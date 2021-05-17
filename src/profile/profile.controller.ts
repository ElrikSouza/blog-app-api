import { Controller, Get, Param } from '@nestjs/common';
import { ProfileNameValidationPipe } from './profile-name.pipe';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':profile')
  public async getOneProfile(
    @Param('profile', ProfileNameValidationPipe) profileName: string,
  ) {
    const profile = await this.profileService.getProfileByName(profileName);

    return profile;
  }
}
