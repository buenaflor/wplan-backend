import { PolicyHandler } from './policy.handler';
import { SetMetadata } from '@nestjs/common';
import { WorkoutDayPolicyFactory } from '../../modules/workout/workout-day/policies/workout-day-policy.factory';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
