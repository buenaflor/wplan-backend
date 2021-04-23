// user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';

@Entity({ name: 'user' })
export class User {
  constructor(
    username: string,
    email: string,
    password: string,
    createdAt: Date,
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
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
}
