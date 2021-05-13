import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  WorkoutDayAction,
  WorkoutDayPolicyFactory,
} from '../policies/workout-day-policy.factory';
import { CaslAbilityFactory } from '../../../../common/casl/casl-ability.factory';
import { WriteWorkoutDayPolicyHandler } from '../policies/write-workout-day-policy.handler';
import { WorkoutPlanCollaboratorService } from '../../workout-plan-collaborator/workout-plan-collaborator.service';
import { ReadWorkoutDayPolicyHandler } from '../policies/read-workout-day-policy.handler';
import { DeleteWorkoutDayPolicyHandler } from '../policies/delete-workout-day-policy.handler';

@Injectable()
export class WorkoutDayAuthorizationService {
  constructor(
    private workoutDayPolicyFactory: WorkoutDayPolicyFactory,
    private workoutAbilityFactory: CaslAbilityFactory,
    private workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  async authorizeRead(workoutPlanId: string, userId: string) {
    this.workoutDayPolicyFactory.setHandler(
      WorkoutDayAction.Read,
      new ReadWorkoutDayPolicyHandler(),
    );
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
    return this.workoutDayPolicyFactory.authorize(
      WorkoutDayAction.Read,
      ability,
    );
  }

  async authorizeWrite(workoutPlanId: string, userId: string) {
    this.workoutDayPolicyFactory.setHandler(
      WorkoutDayAction.Write,
      new WriteWorkoutDayPolicyHandler(),
    );
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
    return this.workoutDayPolicyFactory.authorize(
      WorkoutDayAction.Write,
      ability,
    );
  }

  async authorizeDelete(workoutPlanId: string, userId: string) {
    this.workoutDayPolicyFactory.setHandler(
      WorkoutDayAction.Delete,
      new DeleteWorkoutDayPolicyHandler(),
    );
    const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
      workoutPlanId,
      userId,
    );
    const ability = this.workoutAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
    return this.workoutDayPolicyFactory.authorize(
      WorkoutDayAction.Delete,
      ability,
    );
  }
}
