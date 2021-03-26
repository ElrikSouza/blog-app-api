import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 78)
  password: string;
}
