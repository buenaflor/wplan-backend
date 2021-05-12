import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutPlanPermissionEnum } from '../modules/workout/workout-plan-permission/workout-plan-permission.enum';
import { WorkoutPlanCollaboratorService } from '../modules/workout/workout-plan-collaborator/workout-plan-collaborator.service';

/**
 * Guard only allows access if the collaborator has write access
 *
 */
@Injectable()
export class WorkoutPlanCollaboratorReadAccessGuard implements CanActivate {
  constructor(
    private readonly workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { workoutPlanId } = req.params;
    const authUser = req.user;
    const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
      workoutPlanId,
      authUser.userId,
    );
    if (!collaborator) {
      throw new NotFoundException("Collaborator doesn't exist");
    }
    return (
      collaborator.permission.name === WorkoutPlanPermissionEnum.read ||
      collaborator.permission.name === WorkoutPlanPermissionEnum.write ||
      collaborator.permission.name === WorkoutPlanPermissionEnum.admin
    );
  }
}
