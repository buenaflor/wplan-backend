import { Injectable } from '@nestjs/common';
import { AbstractPolicyFactory } from '../../../../common/policy/abstract-policy.factory';

export enum WorkoutDayAction {
  Read = 'Read',
  Write = 'Write',
  Delete = 'Delete',
}

@Injectable()
export class WorkoutDayPolicyFactory extends AbstractPolicyFactory {}
