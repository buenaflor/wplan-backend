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
    const { ownerName, workoutPlanName } = req.params;
    const authUser = req.user;
    const owner = await this.userService.findOnePublicUserByUsername(ownerName);
    const workoutPlanDto = await this.workoutPlanService.findOneByNameAndUserId(
      workoutPlanName,
      owner.id,
    );
    const res = await this.workoutPlanCollaboratorService.isCollaborator(
      workoutPlanDto.id,
      authUser.userId,
    );
    if (res) {
      req.owner = owner;
      req.workoutPlan = workoutPlanDto;
      req.collaborator = res.collaborator;
    }
    return res !== undefined;
  }
}
