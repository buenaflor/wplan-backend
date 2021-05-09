import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WorkoutPlanId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.params.workoutPlanId;
  },
);
