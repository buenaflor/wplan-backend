import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { WorkoutPlanPermissionEnum } from '../../modules/workout/workout-plan-permission/workout-plan-permission.enum';
import { WorkoutDay } from '../../modules/workout/workout-day/workout-day.entity';
import { WorkoutPlanCollaboratorEntity } from '../../modules/workout/workout-plan-collaborator/workout-plan-collaborator.entity';
import { Injectable } from '@nestjs/common';
import { WorkoutPlan } from '../../modules/workout/workout-plan/workout-plan.entity';
import { Action } from './actions';
import { ExerciseRoutine } from '../../modules/workout/exercise-routine/exercise-routine.entity';

type Subjects =
  | InferSubjects<
      typeof ExerciseRoutine | typeof WorkoutDay | typeof WorkoutPlan
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForWorkoutPlanCollaborator(
    collaborator: WorkoutPlanCollaboratorEntity,
  ) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    switch (collaborator.permission.name) {
      case WorkoutPlanPermissionEnum.admin: {
        can(Action.manage, 'all');
        break;
      }
      case WorkoutPlanPermissionEnum.write: {
        can(Action.read, 'all');
        can(Action.create, 'all');
        can(Action.update, 'all');
        cannot(Action.update, WorkoutPlan);
        cannot(Action.delete, WorkoutPlan);
        break;
      }
      case WorkoutPlanPermissionEnum.read: {
        can(Action.read, 'all');
        break;
      }
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  createForPublicWorkoutPlan() {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    can(Action.read, 'all');

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  createForNoAccess() {
    const { build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
