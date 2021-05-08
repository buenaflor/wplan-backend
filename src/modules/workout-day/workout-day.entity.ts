// muscle-group.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { WorkoutPlan } from '../workout-plan/workout-plan.entity';
import { ExerciseRoutine } from '../exercise-routine/exercise-routine.entity';
import { WorkoutDayDto } from './dto/workout-day.dto';

@Entity({ name: 'workout_day' })
export class WorkoutDay {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  date: string;

  @Column({ length: 40 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ name: 'total_exercises' })
  totalExercises: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => WorkoutPlan, (workoutPlan) => workoutPlan.id)
  @JoinColumn({ name: 'workout_plan_id' })
  workoutPlan: WorkoutPlan;

  @OneToMany(
    () => ExerciseRoutine,
    (exerciseRoutine) => exerciseRoutine.workoutDay,
  )
  exerciseRoutines: ExerciseRoutine[];

  createWorkoutDayDto() {
    return new WorkoutDayDto(
      this.id,
      this.workoutPlan.createPublicWorkoutDto(),
      this.name,
      this.description,
      this.totalExercises,
      this.createdAt,
      this.updatedAt,
    );
  }
}
