// email-verification.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'email_verification' })
export class EmailVerification {
  constructor(token: string, userId: string) {
    this.token = token;
    this.userId = userId;
    this.expirationTime = 120;
  }

  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 255 })
  token: string;

  @Column({ name: 'expiration_time' })
  expirationTime: number;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
