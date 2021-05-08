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
  constructor(partial: Partial<WorkoutDay>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  date: Date;

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

  @Column({ name: 'workout_plan_id' })
  workoutPlanId: string;

  @ManyToOne(() => WorkoutPlan, (workoutPlan) => workoutPlan.id, {
    eager: true,
  })
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
      this.date,
      this.totalExercises,
      this.createdAt,
      this.updatedAt,
    );
  }
}
