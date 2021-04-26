import { Workoutplan } from '../workout-plan.entity';
import { WorkoutPlanDto } from '../dto/workout-plan.dto';
import { PublicUserDto } from '../../user/dto/public-user-dto';

export class WorkoutPlanMapper {
  workoutPlanEntityToDto(workoutPlan: Workoutplan): WorkoutPlanDto {
    return new WorkoutPlanDto(
      workoutPlan.id,
      workoutPlan.name,
      workoutPlan.description,
      workoutPlan.isCompleted,
      workoutPlan.isPrivate,
      workoutPlan.startDate,
      workoutPlan.endDate,
      new PublicUserDto(
        workoutPlan.owner.id,
        workoutPlan.owner.username,
        workoutPlan.owner.email,
      ),
    );
  }
}
