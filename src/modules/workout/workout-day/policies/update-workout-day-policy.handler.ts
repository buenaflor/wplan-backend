import { IPolicyHandler } from '../../../../common/policy/policy.handler';
import { AppAbility } from '../../../../common/casl/casl-ability.factory';
import { Action } from '../../../../common/casl/actions';
import { WorkoutDay } from '../workout-day.entity';

export class UpdateWorkoutDayPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.update, WorkoutDay);
  }
}
