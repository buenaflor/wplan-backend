import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SearchWorkoutPlanDto } from '../dto/search-workout-plan.dto';

export const SearchWorkoutPlanQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const searchWorkoutPlanDto = new SearchWorkoutPlanDto();
    searchWorkoutPlanDto.ownerName = request.query.ownerName;
    searchWorkoutPlanDto.workoutPlanName = request.query.workoutPlanName;
    return searchWorkoutPlanDto;
  },
);
