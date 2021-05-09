// muscle-group.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Exercise } from '../exercise/exercise.entity';

@Entity({ name: 'muscle_group' })
export class MuscleGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => Exercise)
  exercises: Exercise[];
}
