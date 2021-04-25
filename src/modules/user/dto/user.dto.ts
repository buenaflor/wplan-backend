import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  lastLoginAt: Date;

  @IsBoolean()
  @IsNotEmpty()
  isEmailConfirmed: boolean;
}
