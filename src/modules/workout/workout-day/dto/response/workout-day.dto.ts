import { PublicWorkoutPlanDto } from '../../../workout-plan/dto/response/public-workout-plan.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { AbstractDto } from '../../../../../utils/abstract/abstract.dto';

@Exclude()
export class WorkoutDayDto extends AbstractDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose()
  totalExercises: number;

  @Expose()
  @Type(() => PublicWorkoutPlanDto)
  workoutPlan: PublicWorkoutPlanDto;
}
