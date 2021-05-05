import { IsEmail, IsNotEmpty, Length } from 'class-validator';

/**
 * DTO that encapsulates user data that is publicly available
 *
 */
export class PublicUserDto {
  constructor(
    id: string,
    login: string,
    name: string,
    email: string,
    bio: string,
    createdAt: Date,
    updatedAt: Date,
    lastLoginAt: Date,
  ) {
    this.id = id;
    this.login = login;
    this.name = name;
    this.email = email;
    this.bio = bio;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginAt = lastLoginAt;
  }

  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  @Length(3, 40)
  readonly login: string;

  @IsNotEmpty()
  @Length(3, 40)
  readonly name: string;

  @Length(0, 160)
  readonly bio: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly createdAt: Date;

  @IsNotEmpty()
  readonly updatedAt: Date;

  @IsNotEmpty()
  readonly lastLoginAt: Date;
}
