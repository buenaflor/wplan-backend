// user.entity.ts
import { Entity, Column, BeforeInsert } from 'typeorm';
import * as argon2 from 'argon2';
import { PrivateUserDto } from './dto/response/private-user.dto';
import { PublicUserDto } from './dto/response/public-user-dto';
import { AbstractEntity } from '../../utils/abstract/abstract.entity';
import { plainToClass } from 'class-transformer';

@Entity({ name: 'user' })
export class User extends AbstractEntity {
  @Column()
  login: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  bio: string;

  @Column({ name: 'public_workout_plans' })
  publicWorkoutPlans: number;

  @Column({ name: 'private_workout_plans' })
  privateWorkoutPlans: number;

  @Column({ name: 'last_login_at' })
  lastLoginAt: Date;

  @Column({ name: 'email_confirmed' })
  isEmailConfirmed: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  //**************************
  // DTO creation           //
  //**************************

  toPrivateUserDto() {
    return plainToClass(PrivateUserDto, this);
  }

  toPublicUserDto() {
    return plainToClass(PublicUserDto, this);
  }
}
