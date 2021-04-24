import { IsString } from 'class-validator';

export class LoginUserDto {
  readonly id: number;

  @IsString()
  readonly username: string;

  constructor(id: number, username: string) {
    this.id = id;
    this.username = username;
  }
}
