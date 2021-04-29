import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { WorkoutPlanService } from '../workout-plan/workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from '../auth-user/decorator/auth-user.decorator';
import { Paginated } from '../../utils/decorators/paginated.decorator';
import { Routes } from '../../config/constants';

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

  @Get()
  async findAllUsers(@Paginated() paginated) {
    return await this.userService.findAllUsers(paginated);
  }

  /**
   * Returns the publicly or privately available information of a user
   *
   * @param params
   * @param authUser
   */
  @Get(Routes.user.get.one)
  @UseGuards(AllowAnonymousJwtGuard)
  async findUserByUsername(@Param() params, @AuthUser() authUser) {
    const { username } = params;
    if (authUser.username === username) {
      return await this.userService.findOnePrivateUserByUsername(username);
    } else {
      return await this.userService.findOnePublicUserByUsername(username);
    }
  }

  /**
   * Finds all workout plans associated with an owner.
   *
   * @param params
   * @param authUser
   * @param paginated
   */
  @Get(Routes.user.get.workoutPlansByOne)
  @UseGuards(AllowAnonymousJwtGuard)
  async findWorkoutPlansForUser(
    @Param() params,
    @AuthUser() authUser,
    @Paginated() paginated,
  ) {
    const { username } = params;
    if (authUser && authUser.username === username) {
      return await this.workoutPlanService.findAllAccessibleByUser(
        authUser.userId,
        paginated,
      );
    } else {
      const user = await this.userService.findOnePublicUserByUsername(username);
      return await this.workoutPlanService.findAllPublicByUser(
        user.id,
        paginated,
      );
    }
  }
}
