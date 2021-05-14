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
import { AbstractEntity } from '../../../utils/abstract/abstract.entity';

@Entity({ name: 'workout_plan' })
export class WorkoutPlan extends AbstractEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ name: 'is_completed' })
  isCompleted: boolean;

  @Column({ name: 'is_private' })
  isPrivate: boolean;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'user_id' })
  userId: string;

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
