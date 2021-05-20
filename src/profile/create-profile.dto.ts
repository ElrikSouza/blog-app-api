import { Optional } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export class CreateProfileDTO {
  @IsString()
  @Length(2, 30)
  display_name?: string;

  @IsString()
  @Length(2, 30)
  profile_name?: string;

  @IsString()
  @Length(1, 255)
  @Optional()
  bio?: string;
}
