import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../user.entity';
import { PublicUserDto } from './public-user-dto';

/**
 * DTO that encapsulates user data that is privately available
 *
 */
export class PrivateUserDto extends PublicUserDto {
  constructor(
    id: string,
    login: string,
    name: string,
    email: string,
    bio: string,
    createdAt: Date,
    updatedAt: Date,
    lastLoginAt: Date,
    isEmailConfirmed: boolean,
  ) {
    super(id, login, name, email, bio, createdAt, updatedAt, lastLoginAt);
    this.isEmailConfirmed = isEmailConfirmed;
  }

  @IsBoolean()
  @IsNotEmpty()
  readonly isEmailConfirmed: boolean;
}
