import { IsEmail, IsNumber, IsString } from 'class-validator';

export class ResendEmailUserDto {
  @IsNumber()
  readonly id: bigint;

  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;
}
