import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermissionEnum } from '../modules/permission/permission.enum';
import { WorkoutPlanCollaboratorService } from '../modules/workout-plan-collaborator/workout-plan-collaborator.service';

/**
 * Guard only allows access if the collaborator has write access
 *
 */
@Injectable()
export class WorkoutPlanCollaboratorAdminAccessGuard implements CanActivate {
  constructor(
    private readonly workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authUser = req.user;
    const { workoutPlanId } = req.params;
    const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
      workoutPlanId,
      authUser.userId,
    );
    if (!collaborator) {
      throw new NotFoundException("Collaborator doesn't exist");
    }
    return collaborator.permission.name === PermissionEnum.admin;
  }
}
