// user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { PrivateUserDto } from './dto/private-user.dto';
import { PublicUserDto } from './dto/public-user-dto';
import { UserDto } from './dto/user.dto';

@Entity({ name: 'user' })
export class User {
  constructor(
    id?: string,
    username?: string,
    email?: string,
    password?: string,
  ) {
    this.id = id;
    this.login = username;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 40 })
  login: string;

  @Column({ length: 40 })
  name: string;

  @Column({ length: 128 })
  password: string;

  @Column()
  email: string;

  @Column({ length: 160 })
  bio: string;

  @Column({ name: 'public_workout_plans' })
  publicWorkoutPlans: number;

  @Column({ name: 'private_workout_plans' })
  privateWorkoutPlans: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login_at' })
  lastLoginAt: Date;

  @Column({ type: 'boolean', name: 'email_confirmed' })
  isEmailConfirmed: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  //**************************
  // DTO creation           //
  //**************************

  createPrivateUserDto() {
    return new PrivateUserDto(
      this.id,
      this.login,
      this.name,
      this.email,
      this.bio,
      this.createdAt,
      this.updatedAt,
      this.lastLoginAt,
      this.isEmailConfirmed,
      this.publicWorkoutPlans,
      this.privateWorkoutPlans,
    );
  }

  createPublicUserDto() {
    return new PublicUserDto(
      this.id,
      this.login,
      this.name,
      this.email,
      this.bio,
      this.createdAt,
      this.updatedAt,
      this.lastLoginAt,
    );
  }

  createInternalUserDto() {
    return new UserDto(
      this.id,
      this.login,
      this.name,
      this.email,
      this.bio,
      this.password,
      this.createdAt,
      this.updatedAt,
      this.lastLoginAt,
      this.isEmailConfirmed,
      this.publicWorkoutPlans,
      this.privateWorkoutPlans,
    );
  }
}
