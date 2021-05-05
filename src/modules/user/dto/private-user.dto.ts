import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../user.entity';

/**
 * DTO that encapsulates user data that is privately available
 *
 */
export class PrivateUserDto {
  constructor(
    id: string,
    username: string,
    email: string,
    createdAt: Date,
    lastLoginAt: Date,
    isEmailConfirmed: boolean,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
    this.isEmailConfirmed = isEmailConfirmed;
  }

  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDate()
  readonly lastLoginAt: Date;

  @IsBoolean()
  @IsNotEmpty()
  readonly isEmailConfirmed: boolean;

  static createFromUser(user: User) {
    return new PrivateUserDto(
      user.id,
      user.login,
      user.email,
      user.createdAt,
      user.lastLoginAt,
      user.isEmailConfirmed,
    );
  }
}
