import { IsDateString } from 'class-validator';

export class CreateWorkoutDayDto {
  @IsDateString()
  date: Date;

  name: string;

  workoutPlanId: string;

  description: string;
}
