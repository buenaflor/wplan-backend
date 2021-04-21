// exercise.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { License } from '../license/license.entity';

@Entity({ name: 'exercise' })
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'date', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, name: 'license_author' })
  licenseAuthor: string;

  @ManyToOne(() => License, (license) => license.id)
  @JoinColumn({ name: 'license_id' })
  license: License;
}
