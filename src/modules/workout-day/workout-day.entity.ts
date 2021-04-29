// muscle-group.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { WorkoutPlan } from '../workout-plan/workout-plan.entity';
import { ExerciseRoutine } from '../exercise-routine/exercise-routine.entity';

@Entity({ name: 'workout_day' })
export class WorkoutDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @ManyToOne(() => WorkoutPlan, (workoutPlan) => workoutPlan.id)
  @JoinColumn({ name: 'workout_plan_id' })
  workoutPlan: WorkoutPlan;

  @OneToMany(
    () => ExerciseRoutine,
    (exerciseRoutine) => exerciseRoutine.workoutDay,
  )
  exerciseRoutines: ExerciseRoutine[];
}
