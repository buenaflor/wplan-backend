import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from "../../user/user.entity";

export class UserProfileDto {
  constructor(id, username, email, firstName, lastName, isPublic) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isPublic = isPublic;
  }

  @IsNumber()
  id: bigint;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  static createFromUser(user: User) {
    return new UserProfileDto(
      user.id,
      user.username,
      user.email,
      user.userProfile.firstName,
      user.userProfile.lastName,
      user.userProfile.isPublic,
    );
  }
}
