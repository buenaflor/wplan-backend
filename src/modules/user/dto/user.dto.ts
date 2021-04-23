import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches('(?=.*[0-9])')
  readonly password: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  lastLoginAt: Date;

  @IsBoolean()
  @IsNotEmpty()
  isEmailConfirmed: boolean;
}
