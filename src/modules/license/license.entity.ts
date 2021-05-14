// license.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exercise } from '../workout/exercise/exercise.entity';
import { AbstractEntity } from "../../utils/abstract/abstract.entity";

@Entity({ name: 'license' })
export class License extends AbstractEntity {
  @Column({ type: 'varchar', length: 255, name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 128, name: 'short_name' })
  shortName: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;
}
