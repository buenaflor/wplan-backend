import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WorkoutPlan = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.workoutPlan;
  },
);
