import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

/**
 * CreateUserDto which is used to encapsulate data received from
 * a post request to the /users endpoint
 *
 * The password will be in plaintext and should be hashed via argon2
 */
export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches('(?=.*[0-9])')
  readonly password: string;
}
