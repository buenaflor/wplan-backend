// exercise-wl-set.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseRoutine } from '../exercise-routine/exercise-routine.entity';

@Entity({ name: 'exercise_wl_set' })
export class ExerciseWlSet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint' })
  weight: number;

  @Column({ type: 'smallint' })
  repetitions: number;

  @Column({ type: 'varchar', length: 32 })
  unit: string;

  @ManyToOne(() => ExerciseRoutine, (exerciseRoutine) => exerciseRoutine.id)
  @JoinColumn({ name: 'exercise_routine_id' })
  exerciseRoutine: ExerciseRoutine;
}
