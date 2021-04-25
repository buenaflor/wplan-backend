// user-profile.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_profile' })
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  lastName: string;

  @Column({ type: 'boolean', name: 'is_public' })
  isPublic = true;
}
