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
import { WorkoutDayDto } from './dto/response/workout-day.dto';
import { plainToClass } from 'class-transformer';
import { AbstractEntity } from "../../../utils/abstract/abstract.entity";

@Entity({ name: 'workout_day' })
export class WorkoutDay extends AbstractEntity {
  constructor(partial: Partial<WorkoutDay>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  date: Date;

  @Column({ length: 40 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ name: 'total_exercises' })
  totalExercises: number;

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

  toDto() {
    return plainToClass(WorkoutDayDto, this);
  }
}
