import { Injectable, UnauthorizedException } from '@nestjs/common';
import { WorkoutAbilityFactory } from '../../../../common/casl/workout-ability-factory.service';
import { WorkoutPlanCollaboratorService } from '../../workout-plan-collaborator/workout-plan-collaborator.service';
import { ReadWorkoutPlanPolicyHandler } from '../policy/read-workout-plan-policy.handler';
import { AdminWorkoutPlanPolicyHandler } from '../policy/admin-workout-plan-policy.handler';
import { WriteWorkoutPlanPolicyHandler } from '../policy/write-workout-plan-policy.handler';
import { AuthUserDto } from '../../../auth-user/dto/auth-user.dto';
import { WorkoutPlan } from '../workout-plan.entity';

@Injectable()
export class WorkoutPlanAuthorizationService {
  constructor(
    private workoutAbilityFactory: WorkoutAbilityFactory,
    private workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  async authorizeRead(workoutPlan: WorkoutPlan, authUser: AuthUserDto) {
    if (!workoutPlan.isPrivate) return true;
    if (authUser) {
      const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
        workoutPlan.id,
        authUser.userId,
      );
      if (!collaborator) {
        throw new UnauthorizedException();
      }
      const ability = this.workoutAbilityFactory.createForWorkoutPlanCollaborator(
        collaborator,
      );
      const handler = new ReadWorkoutPlanPolicyHandler();
      return handler.handle(ability);
    }
    return false;
  }

  async authorizeWrite(workoutPlanId: string, userId: string) {
    const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
      workoutPlanId,
      userId,
    );
    if (!collaborator) {
      throw new UnauthorizedException();
    }
    const ability = this.workoutAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
    const handler = new WriteWorkoutPlanPolicyHandler();
    return handler.handle(ability);
  }

  async authorizeDelete(workoutPlanId: string, userId: string) {
    const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
      workoutPlanId,
      userId,
    );
    const ability = this.workoutAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
    const handler = new AdminWorkoutPlanPolicyHandler();
    return handler.handle(ability);
  }
}
