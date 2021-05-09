import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IsBeforeOrSameDateConstraint } from '../../../../../utils/validation/is-before.constraint';

export class CreateWorkoutPlanDto {
  @IsString()
  @Length(0, 40)
  @IsNotEmpty()
  name: string;

  @Length(0, 500)
  description: string;

  isCompleted: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @IsDateString()
  @IsNotEmpty()
  @Validate(IsBeforeOrSameDateConstraint, ['endDate'])
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
