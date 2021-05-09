import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutDayDto } from './create-workout-day.dto';
import { IsEmpty } from 'class-validator';

export class UpdateWorkoutDayDto extends PartialType(CreateWorkoutDayDto) {
  // Id has to be empty when the client sends the request body
  @IsEmpty()
  id: string;

  name: string;

  description: string;

  date: Date;
}
