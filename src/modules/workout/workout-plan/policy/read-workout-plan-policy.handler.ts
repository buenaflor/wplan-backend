import { IPolicyHandler } from '../../../../common/policy/policy.handler';
import { AppAbility } from '../../../../common/casl/workout-ability-factory.service';
import { Action } from '../../../../common/casl/actions';
import { WorkoutPlan } from '../workout-plan.entity';

export class ReadWorkoutPlanPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.read, WorkoutPlan);
  }
}
