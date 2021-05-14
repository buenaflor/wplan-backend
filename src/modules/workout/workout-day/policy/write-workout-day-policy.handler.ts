import { IPolicyHandler } from '../../../../common/policy/policy.handler';
import { AppAbility } from '../../../../common/casl/workout-ability-factory.service';
import { Action } from '../../../../common/casl/actions';
import { WorkoutDay } from '../workout-day.entity';

export class WriteWorkoutDayPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return (
      ability.can(Action.update, WorkoutDay) &&
      ability.can(Action.create, WorkoutDay)
    );
  }
}
