import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  Length,
  Validate,
} from 'class-validator';
import { Exercise } from '../../../exercise/exercise.entity';
import { Type } from 'class-transformer';

export class CreateExerciseRoutineDto {
  @IsNotEmpty()
  @Type(() => Exercise)
  name: Exercise;
}
