import { IsBoolean, IsDateString, IsNumber, IsString } from "class-validator";

export class CreateWorkoutPlanDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsBoolean()
  isPrivate: boolean;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  userId: bigint;
}
