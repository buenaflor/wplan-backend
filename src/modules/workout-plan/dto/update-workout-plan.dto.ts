import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutPlanDto } from './create-workout-plan.dto';

export class UpdateWorkoutPlanDto extends PartialType(CreateWorkoutPlanDto) {
  name: string;

  description: string;

  isCompleted: boolean;

  isPrivate: boolean;

  startDate: Date;

  endDate: Date;
}
