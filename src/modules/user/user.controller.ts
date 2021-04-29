import { Body, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { WorkoutPlanService } from '../workout-plan/workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from '../auth-user/decorator/auth-user.decorator';

/**
 * This controller provides endpoints for handling
 * publicly available information about someone
 * with an account
 *
 */
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private workoutPlanService: WorkoutPlanService,
  ) {}

  @Get()
  async findAllUsers(@Query('page') page = 1, @Query('per_page') perPage = 30) {
    return await this.userService.findAllPublicUsers({ page, limit: perPage });
  }

  /**
   * Returns the publicly available information of a user
   *
   * @param params
   * @param authUser
   */
  @Get('/:username')
  @UseGuards(AllowAnonymousJwtGuard)
  async findUserByUsername(@Param() params, @AuthUser() authUser) {
    const { username } = params;
    if (authUser.username === username) {
      return await this.userService.findPrivateUserByUsername(username);
    } else {
      return await this.userService.findPublicUserByUsername(username);
    }
  }

  /**
   * Finds all workout plans associated with an owner.
   *
   * @param params
   * @param authUser
   * @param page
   * @param perPage
   */
  @Get('/:username/workout_plans')
  @UseGuards(AllowAnonymousJwtGuard)
  async findWorkoutPlansForUser(
    @Param() params,
    @AuthUser() authUser,
    @Query('page') page = 1,
    @Query('per_page') perPage = 30,
  ) {
    perPage = perPage > 100 ? 100 : perPage;
    const { username } = params;
    if (authUser && authUser.username === username) {
      return await this.workoutPlanService.findAllByAuthenticatedOwner(
        authUser.userId,
        {
          page,
          limit: perPage,
        },
      );
    } else {
      const user = await this.userService.findPublicUserByUsername(username);
      return await this.workoutPlanService.findAllPublicByOwner(user.id, {
        page,
        limit: perPage,
      });
    }
  }
}
