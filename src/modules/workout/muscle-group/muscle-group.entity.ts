// muscle-group.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Exercise } from '../exercise/exercise.entity';
import { AbstractEntity } from "../../../utils/abstract/abstract.entity";

@Entity({ name: 'muscle_group' })
export class MuscleGroup extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => Exercise)
  exercises: Exercise[];
}
