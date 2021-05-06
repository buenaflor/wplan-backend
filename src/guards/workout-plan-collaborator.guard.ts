import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WorkoutPlanCollaboratorService } from '../modules/workout-plan-collaborator/workout-plan-collaborator.service';
import { WorkoutPlanService } from '../modules/workout-plan/workout-plan.service';
import { UserService } from '../modules/user/user.service';

/**
 * Guard only allows access if the requestor is a collaborator
 *
 */
@Injectable()
export class WorkoutPlanCollaboratorGuard implements CanActivate {
  constructor(
    private readonly workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
    private readonly workoutPlanService: WorkoutPlanService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { workoutPlanId } = req.params;
    const authUser = req.user;
    const workoutPlanDto = await this.workoutPlanService.findOneById(
      workoutPlanId,
    );
    const res = await this.workoutPlanCollaboratorService.isCollaborator(
      workoutPlanDto.id,
      authUser.userId,
    );
    return res !== undefined;
  }
}
