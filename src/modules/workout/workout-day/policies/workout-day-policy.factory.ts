import { Injectable } from '@nestjs/common';
import { AbstractPolicyFactory } from '../../../../common/policy/abstract-policy.factory';
import { ReadWorkoutDayPolicyHandler } from './read-workout-day-policy.handler';
import { UpdateWorkoutDayPolicyHandler } from './update-workout-day-policy.handler';
import { DeleteWorkoutDayPolicyHandler } from './delete-workout-day-policy.handler';

export enum WorkoutDayAction {
  ReadOne = 'ReadOne',
  UpdateMultiple = 'UpdateMultiple',
  DeleteOne = 'DeleteOne',
}

@Injectable()
export class WorkoutDayPolicyFactory extends AbstractPolicyFactory {
  configureForClass() {
    this.setHandler(
      WorkoutDayAction.ReadOne,
      new ReadWorkoutDayPolicyHandler(),
    );
    this.setHandler(
      WorkoutDayAction.UpdateMultiple,
      new UpdateWorkoutDayPolicyHandler(),
    );
    this.setHandler(
      WorkoutDayAction.DeleteOne,
      new DeleteWorkoutDayPolicyHandler(),
    );
  }
}

export function TestDec() {}
