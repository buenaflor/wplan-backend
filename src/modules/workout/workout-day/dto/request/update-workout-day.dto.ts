import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutDayDto } from './create-workout-day.dto';
import { IsDateString, IsUUID, MaxLength } from 'class-validator';

export class UpdateWorkoutDayDto extends PartialType(CreateWorkoutDayDto) {
  @IsUUID()
  id: string;

  @IsUUID()
  workoutPlanId: string;

  @MaxLength(40)
  name: string;

  @MaxLength(500)
  description: string;

  @IsDateString()
  date: Date;
}
