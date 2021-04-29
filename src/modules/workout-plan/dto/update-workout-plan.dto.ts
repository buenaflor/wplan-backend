import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutPlanDto } from './create-workout-plan.dto';

export class UpdateWorkoutPlanDto extends PartialType(
  OmitType(CreateWorkoutPlanDto, ['userId'] as const),
) {
  name: string;

  description: string;

  isCompleted: boolean;

  isPrivate: boolean;

  startDate: Date;

  endDate: Date;
}
