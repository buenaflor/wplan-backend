import { IsBoolean, IsDate, IsString } from 'class-validator';

export class UpdateWorkoutPlanDto {
  @IsString()
  name: string;

  description: string;

  isCompleted: boolean;

  isPrivate: boolean;

  startDate: Date;

  endDate: Date;
}
