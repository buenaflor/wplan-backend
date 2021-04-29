import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateWorkoutPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
