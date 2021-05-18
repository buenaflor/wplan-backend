// exercise-routine.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';

import { Exercise } from '../exercise/exercise.entity';
import { WorkoutDay } from '../workout-day/workout-day.entity';
import { ExerciseWlSet } from './exercise-wl-set/exercise-wl-set.entity';

@Entity({ name: 'exercise_routine' })
export class ExerciseRoutine {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Exercise, (exercise) => exercise.id)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column({ length: 500 })
  description: string;

  @Column()
  order: number;

  @ManyToOne(() => WorkoutDay, (workoutDay) => workoutDay.id)
  @JoinColumn({ name: 'workout_day_id' })
  workoutDay: WorkoutDay;

  @OneToMany(
    () => ExerciseWlSet,
    (exerciseWlSet) => exerciseWlSet.exerciseRoutine,
  )
  wlSets: ExerciseWlSet[];
}
