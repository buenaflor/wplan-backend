import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

/**
 * Internal representation of a user. This DTO should not be exposed to the public
 *
 */
export class UserDto {
  constructor(
    id: string,
    login: string,
    name: string,
    email: string,
    bio: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    lastLoginAt: Date,
    isEmailConfirmed: boolean,
    publicWorkoutPlans: number,
    privateWorkoutPlans: number,
  ) {
    this.id = id;
    this.login = login;
    this.name = name;
    this.email = email;
    this.bio = bio;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginAt = lastLoginAt;
    this.isEmailConfirmed = isEmailConfirmed;
    this.publicWorkoutPlans = publicWorkoutPlans;
    this.privateWorkoutPlans = privateWorkoutPlans;
  }

  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  readonly bio: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly createdAt: Date;

  @IsNotEmpty()
  readonly updatedAt: Date;

  readonly lastLoginAt: Date;

  @IsNotEmpty()
  readonly isEmailConfirmed: boolean;

  @IsNotEmpty()
  readonly publicWorkoutPlans: number;

  @IsNotEmpty()
  readonly privateWorkoutPlans: number;
}
