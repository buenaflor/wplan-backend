import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

/**
 * CreateUserDto which is used to encapsulate data received from
 * a post request to the /users endpoint
 *
 * The password will be in plaintext and should be hashed via argon2
 */
export class CreateUserDto {
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
}
