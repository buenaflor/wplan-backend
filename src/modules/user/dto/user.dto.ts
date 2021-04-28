import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

/**
 * Internal representation of a user. This DTO should not be exposed to the public
 *
 */
export class UserDto {
  constructor(
    id: bigint,
    username: string,
    email: string,
    password: string,
    createdAt: Date,
    lastLoginAt: Date,
    isEmailConfirmed: boolean,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
    this.isEmailConfirmed = isEmailConfirmed;
  }

  @IsNumber()
  @IsNotEmpty()
  readonly id: bigint;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
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
