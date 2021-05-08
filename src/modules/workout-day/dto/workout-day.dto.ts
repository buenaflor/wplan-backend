import { IsDate, IsNumber, IsObject } from 'class-validator';
import { PublicWorkoutPlanDto } from '../../workout-plan/dto/public-workout-plan.dto';

export class WorkoutDayDto {
  constructor(
    id: string,
    workoutPlanDto: PublicWorkoutPlanDto,
    name: string,
    description: string,
    totalExercises: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.workoutPlan = workoutPlanDto;
    this.name = name;
    this.description = description;
    this.totalExercises = totalExercises;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @IsNumber()
  id: string;

  @IsObject()
  workoutPlan: PublicWorkoutPlanDto;

  name: string;

  description: string;

  @IsNumber()
  totalExercises: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
