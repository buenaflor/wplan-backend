// workout-plan.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkoutDay } from '../workout-day/workout-day.entity';
import { User } from '../../user/user.entity';
import { PublicWorkoutPlanDto } from './dto/response/public-workout-plan.dto';
import { plainToClass } from 'class-transformer';

@Entity({ name: 'workout_plan' })
export class WorkoutPlan {
  constructor(
    name: string,
    description: string,
    isCompleted: boolean,
    isPrivate: boolean,
    startDate: Date,
    endDate: Date,
    userId: bigint,
  ) {
    this.name = name;
    this.description = description;
    this.isCompleted = isCompleted;
    this.isPrivate = isPrivate;
    this.startDate = startDate;
    this.endDate = endDate;
    this.userId = userId;
  }

  @PrimaryGeneratedColumn()
  id: string;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: bigint;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(() => WorkoutDay, (workoutDay) => workoutDay.workoutPlan)
  workoutDays: WorkoutDay[];

  //**************************
  // DTO creation           //
  //**************************

  createPublicWorkoutDto(): PublicWorkoutPlanDto {
    return plainToClass(PublicWorkoutPlanDto, this);
  }
}
