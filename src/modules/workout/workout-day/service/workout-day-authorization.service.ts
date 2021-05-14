import { Injectable, UnauthorizedException } from '@nestjs/common';
import { WorkoutAbilityFactory } from '../../../../common/casl/workout-ability-factory.service';
import { WriteWorkoutDayPolicyHandler } from '../policy/write-workout-day-policy.handler';
import { WorkoutPlanCollaboratorService } from '../../workout-plan-collaborator/workout-plan-collaborator.service';
import { ReadWorkoutDayPolicyHandler } from '../policy/read-workout-day-policy.handler';
import { DeleteWorkoutDayPolicyHandler } from '../policy/delete-workout-day-policy.handler';

@Injectable()
export class WorkoutDayAuthorizationService {
  constructor(
    private workoutAbilityFactory: WorkoutAbilityFactory,
    private workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  async authorizeRead(workoutPlanId: string, userId: string) {
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
    const handler = new ReadWorkoutDayPolicyHandler();
    return handler.handle(ability);
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
    const handler = new WriteWorkoutDayPolicyHandler();
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
    const handler = new DeleteWorkoutDayPolicyHandler();
    return handler.handle(ability);
  }
}
