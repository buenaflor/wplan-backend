import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsNumber,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseRoutineBulkDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateExerciseRoutineDto)
  exerciseRoutines: [CreateExerciseRoutineDto];
}

export class CreateExerciseRoutineDto {
  @IsEmpty()
  workoutDayId: string;

  @IsDateString()
  date: Date;

  @IsUUID()
  exerciseId: string;

  @MaxLength(40)
  name: string;

  @MaxLength(500)
  description: string;

  @IsNumber()
  order: number;
}
