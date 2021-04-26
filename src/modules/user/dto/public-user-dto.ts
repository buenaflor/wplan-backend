import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO that encapsulates user data that is publicly available
 *
 */
export class PublicUserDto {
  constructor(id: bigint, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  @IsNotEmpty()
  @IsNumber()
  readonly id: bigint;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
