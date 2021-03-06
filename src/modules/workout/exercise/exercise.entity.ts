// exercise.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { License } from '../../license/license.entity';
import { MuscleGroup } from '../muscle-group/muscle-group.entity';
import { AbstractEntity } from "../../../utils/abstract/abstract.entity";

@Entity({ name: 'exercise' })
export class Exercise extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 255, name: 'license_author' })
  licenseAuthor: string;

  @ManyToOne(() => License, (license) => license.id)
  @JoinColumn({ name: 'license_id' })
  license: License;

  @ManyToMany(() => MuscleGroup, (muscleGroup) => muscleGroup.id)
  @JoinTable({
    name: 'exercise_muscle',
    joinColumn: { name: 'exercise_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'muscle_group_id', referencedColumnName: 'id' },
  })
  muscleGroups: MuscleGroup[];
}
