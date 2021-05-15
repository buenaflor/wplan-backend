import { Exclude, Expose } from 'class-transformer';
import { AbstractDto } from '../../../../../utils/abstract/abstract.dto';

@Exclude()
export class WorkoutDayDto extends AbstractDto {
  @Expose()
  workoutPlanId: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose()
  totalExercises: number;
}
