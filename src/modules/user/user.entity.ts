// user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { PrivateUserDto } from './dto/private-user.dto';
import { PublicUserDto } from './dto/public-user-dto';
import { UserDto } from './dto/user.dto';

@Entity({ name: 'user' })
export class User {
  constructor(
    id?: number,
    username?: string,
    email?: string,
    password?: string,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 128 })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'last_login_at' })
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
      this.username,
      this.email,
      this.createdAt,
      this.lastLoginAt,
      this.isEmailConfirmed,
    );
  }

  createPublicUserDto() {
    return new PublicUserDto(
      this.id,
      this.username,
      this.email,
      this.createdAt,
      this.lastLoginAt,
    );
  }

  createInternalUserDto() {
    return new UserDto(
      this.id,
      this.username,
      this.email,
      this.password,
      this.createdAt,
      this.lastLoginAt,
      this.isEmailConfirmed,
    );
  }
}
