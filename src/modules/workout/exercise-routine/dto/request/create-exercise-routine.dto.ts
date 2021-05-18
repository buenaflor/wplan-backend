import {
  ArrayNotEmpty,
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseRoutineDto {
  @IsUUID()
  exerciseId: string;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => CreateExerciseWlSet)
  sets: [CreateExerciseWlSet];
}

class CreateExerciseWlSet {
  @IsInt()
  repetition: number;

  @IsNumber()
  weight: number;

  @IsString()
  @IsIn(['kg', 'lbs'])
  unit: string;
}
