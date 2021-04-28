// workout-plan.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { WorkoutDay } from '../workout-day/workout-day.entity';
import { User } from '../user/user.entity';
import { PublicWorkoutPlanDto } from './dto/public-workout-plan.dto';
import { PrivateWorkoutPlanDto } from './dto/private-workout-plan.dto';

@Entity({ name: 'workout_plan' })
export class Workoutplan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'boolean', name: 'is_completed' })
  isCompleted: boolean;

  @Column({ type: 'boolean', name: 'is_private' })
  isPrivate: boolean;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: bigint;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(() => WorkoutDay, (workoutDay) => workoutDay.workoutPlan)
  workoutDays: WorkoutDay[];

  //**************************
  // DTO creation           //
  //**************************

  createPublicWorkoutDto(): PublicWorkoutPlanDto {
    return new PublicWorkoutPlanDto(
      this.id,
      this.name,
      this.description,
      this.isCompleted,
      this.isPrivate,
      this.startDate,
      this.endDate,
      this.owner,
    );
  }

  createPrivateWorkoutDto(): PrivateWorkoutPlanDto {
    return new PrivateWorkoutPlanDto(
      this.id,
      this.name,
      this.description,
      this.isCompleted,
      this.isPrivate,
      this.startDate,
      this.endDate,
      this.owner,
    );
  }
}
