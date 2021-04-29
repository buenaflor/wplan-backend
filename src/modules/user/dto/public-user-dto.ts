import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

/**
 * DTO that encapsulates user data that is publicly available
 *
 */
export class PublicUserDto {
  constructor(
    id: number,
    username: string,
    email: string,
    createdAt: Date,
    lastLoginAt: Date,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
  }

  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

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
}
