import { Module } from '@nestjs/common';
import { WorkoutDayPolicyFactory } from './workout-day-policy.factory';

@Module({
  providers: [WorkoutDayPolicyFactory],
  exports: [WorkoutDayPolicyFactory],
})
export class WorkoutDayPolicyModule {}
