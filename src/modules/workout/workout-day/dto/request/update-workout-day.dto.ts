import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutDayDto } from './create-workout-day.dto';

export class UpdateWorkoutDayDto extends PartialType(CreateWorkoutDayDto) {
  id: string;

  workoutPlanId: string;

  name: string;

  description: string;

  date: Date;
}
