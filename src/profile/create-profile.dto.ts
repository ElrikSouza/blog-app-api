import { Optional } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export class EditProfileDTO {
  @IsString()
  @Length(2, 35)
  @Optional()
  display_name?: string;

  @IsString()
  @Length(2, 35)
  @Optional()
  profile_name?: string;

  @IsString()
  @Length(1, 255)
  @Optional()
  bio?: string;
}
