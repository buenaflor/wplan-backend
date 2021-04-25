// email-verification.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'email_verification' })
export class EmailVerification {
  constructor(token: string, userId: bigint) {
    this.token = token;
    this.userId = userId;
    this.expirationTime = 120;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  token: string;

  @Column({ type: 'integer', name: 'expiration_time' })
  expirationTime: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: bigint;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
