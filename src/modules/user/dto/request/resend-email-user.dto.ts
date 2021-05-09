import { IsEmail, IsString } from 'class-validator';

export class ResendEmailUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;
}
