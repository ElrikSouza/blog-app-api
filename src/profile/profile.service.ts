import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { v4 as uuid } from 'uuid';
import { EditProfileDTO } from './edit-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  public async isProfileNameAvailable(profile_name: string) {
    const count = await this.userProfileRepository.count({ profile_name });

    return count === 0;
  }

  public async countProfilesAssociatedToaAccount(account_id: string) {
    return this.userProfileRepository.count({ account_id });
  }

  public async createProfile(
    profile: Omit<UserProfile, 'id' | 'account_id'>,
    accountId: string,
  ) {
    const profileCount = await this.countProfilesAssociatedToaAccount(
      accountId,
    );

    if (profileCount >= 2) {
      throw new ConflictException(
        'You already have two profiles associated to this account.',
      );
    }

    const isProfileNameAvailable = await this.isProfileNameAvailable(
      profile.profile_name,
    );

    if (!isProfileNameAvailable) {
      throw new ConflictException(
        'The requested profile name has already been taken.',
      );
    }

    this.userProfileRepository.insert({
      ...profile,
      id: uuid(),
      account_id: accountId,
    });
  }

  public async getProfileByName(profile_name: string) {
    const profile = await this.userProfileRepository.findOne({ profile_name });

    if (!profile) {
      throw new NotFoundException('The requested profile does not exist.');
    }

    return profile;
  }

  public async getProfileById(id: string) {
    const profile = await this.userProfileRepository.findOne({ id });

    if (!profile) {
      throw new NotFoundException('The requested profile does not exist.');
    }

    return profile;
  }

  public async getProfilesByAccount(account_id: string) {
    return this.userProfileRepository.find({ account_id });
  }

  public async editProfile(
    account_id: string,
    profile_id: string,
    editProfileDto: EditProfileDTO,
  ) {
    const profile = await this.getProfileById(profile_id);

    if (profile.account_id !== account_id) {
      throw new UnauthorizedException('You do not own this profile.');
    }

    await this.userProfileRepository.update({ id: profile_id }, editProfileDto);
  }

  public async deleteProfile(account_id: string, profile_id: string) {
    const profile = await this.getProfileById(profile_id);

    if (profile.account_id !== account_id) {
      throw new UnauthorizedException('You do not own this profile.');
    }

    await this.userProfileRepository.delete({ id: profile_id });
  }
}
