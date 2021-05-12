import { AppAbility } from '../../../../common/casl/casl-ability.factory';
import { Action } from '../../../../common/casl/actions';
import { WorkoutDay } from '../workout-day.entity';
import { IPolicyHandler } from '../../../../common/policy/policy.handler';

export class ReadWorkoutDayPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.read, WorkoutDay);
  }
}
