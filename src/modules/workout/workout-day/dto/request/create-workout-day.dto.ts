import { ArrayMinSize, IsArray, IsDateString, IsEmpty, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateWorkoutDayBulkDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => CreateWorkoutDayDto)
  workoutDays: [CreateWorkoutDayDto];
}


export class CreateWorkoutDayDto {
  @IsDateString()
  date: Date;

  @MaxLength(40)
  name: string;

  @IsEmpty()
  workoutPlanId: string;

  @MaxLength(500)
  description: string;
}
