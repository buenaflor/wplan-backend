import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { WorkoutPlanService } from '../workout/workout-plan/service/workout-plan.service';
import { Paginated } from '../../utils/decorators/paginated.decorator';
import { Routes } from '../../config/constants';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

/**
 * This controller provides endpoints for handling
 * publicly available information about someone
 * with an account
 *
 */
@Controller(Routes.user.controller)
export class UserController {
  constructor(
    private userService: UserService,
    private workoutPlanService: WorkoutPlanService,
  ) {}

  /**
   * Returns a list of users with public information
   *
   * @param paginated
   */
  @Get()
  async findAllUsers(@Paginated() paginated) {
    return await this.userService.findAllUsers(paginated);
  }

  /**
   * Returns the publicly available information of a user
   *
   * @param params
   */
  @Get(Routes.user.get.one)
  async findUserByUsername(@Param() params) {
    const { username } = params;
    return await this.userService.findOnePublicUserByUsername(username);
  }

  /**
   * Finds all public workout plans associated with an owner.
   *
   * @param params
   * @param paginated
   */
  @Get(Routes.user.get.workoutPlansByOne)
  async findWorkoutPlansForUser(@Param() params, @Paginated() paginated) {
    const { username } = params;
    const user = await this.userService.findOnePublicUserByUsername(username);
    return await this.workoutPlanService.findAllPublicByUser(
      paginated,
      user.id,
    );
  }
}
