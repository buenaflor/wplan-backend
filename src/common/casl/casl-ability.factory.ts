import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { PermissionEnum } from '../../modules/permission/permission.enum';
import { WorkoutDay } from '../../modules/workout/workout-day/workout-day.entity';
import { WorkoutPlanCollaboratorEntity } from '../../modules/workout/workout-plan-collaborator/workout-plan-collaborator.entity';
import { Injectable } from '@nestjs/common';
import { WorkoutPlan } from '../../modules/workout/workout-plan/workout-plan.entity';
import { Action } from './actions';

type Subjects = InferSubjects<typeof WorkoutDay | typeof WorkoutPlan> | 'all';

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
      case PermissionEnum.admin: {
        can(Action.manage, 'all');
        break;
      }
      case PermissionEnum.write: {
        can(Action.create, 'all');
        cannot(Action.delete, WorkoutPlan);
        break;
      }
      case PermissionEnum.read: {
        can(Action.read, 'all');
        break;
      }
      case PermissionEnum.none: {
        cannot(Action.manage, 'all');
        break;
      }
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
