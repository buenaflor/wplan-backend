import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutDayDto } from './create-workout-day.dto';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWorkoutDayBulkDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => UpdateWorkoutDayDto)
  workoutDays: [UpdateWorkoutDayDto];
}

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
