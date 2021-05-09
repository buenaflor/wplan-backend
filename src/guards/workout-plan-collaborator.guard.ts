import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WorkoutPlanCollaboratorService } from '../modules/workout/workout-plan-collaborator/workout-plan-collaborator.service';

/**
 * Guard only allows access if the requestor is a collaborator
 *
 */
@Injectable()
export class WorkoutPlanCollaboratorGuard implements CanActivate {
  constructor(
    private readonly workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { workoutPlanId } = req.params;
    const authUser = req.user;
    const res = await this.workoutPlanCollaboratorService.isCollaborator(
      workoutPlanId,
      authUser.userId,
    );
    return !!res;
  }
}
