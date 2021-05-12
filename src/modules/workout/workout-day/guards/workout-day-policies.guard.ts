import {
  AppAbility,
  CaslAbilityFactory,
} from '../../../../common/casl/casl-ability.factory';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PolicyHandler } from '../../../../common/policy/policy.handler';
import { CHECK_POLICIES_KEY } from '../../../../common/policy/check-policies.decorator';
import { WorkoutPlanCollaboratorService } from '../../workout-plan-collaborator/workout-plan-collaborator.service';
import { WorkoutDayService } from '../workout-day.service';
import { WorkoutDayDto } from '../dto/response/workout-day.dto';
import { UpdateWorkoutDayDto } from '../dto/request/update-workout-day.dto';

@Injectable()
export class WorkoutDayPoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
    private workoutDayService: WorkoutDayService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { workoutDayId } = context.switchToHttp().getRequest().params;
    const { user } = context.switchToHttp().getRequest();
    let ability;
    if (workoutDayId) {
      const res = await this.getAbilityFromWorkoutDayId(workoutDayId, user);
      ability = res.ability;
      context.switchToHttp().getRequest().workoutDay = res.workoutDay;
    } else {
      const updateWorkoutDayDtos = context.switchToHttp().getRequest().body;
      ability = await this.getAbilityFromUpdateWorkoutDays(
        updateWorkoutDayDtos,
        user,
      );
    }
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  /**
   * UpdateWorkoutDaysDtos must have length > 0
   *
   * @param updateWorkoutDayDtos
   * @param user
   * @private
   */
  private async getAbilityFromUpdateWorkoutDays(
    updateWorkoutDayDtos: [UpdateWorkoutDayDto],
    user: any,
  ) {
    const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
      updateWorkoutDayDtos[0].workoutPlanId,
      user.userId,
    );
    return this.caslAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
  }

  private async getAbilityFromWorkoutDayId(workoutDayId: string, user: any) {
    const workoutDay = await this.workoutDayService.findOneById(workoutDayId);
    let ability;
    if (!workoutDay.workoutPlan.isPrivate) {
      ability = this.caslAbilityFactory.createForPublicWorkoutPlan();
    } else if (!user) {
      ability = this.caslAbilityFactory.createForNoAccess();
    } else {
      const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
        workoutDay.workoutPlan.id,
        user.userId,
      );
      ability = this.caslAbilityFactory.createForWorkoutPlanCollaborator(
        collaborator,
      );
    }
    return { ability, workoutDay };
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
