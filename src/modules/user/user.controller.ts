import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileDto } from '../user-profile/dto/user-profile.dto';
import { WorkoutPlanService } from '../workout-plan/workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from './decorator/auth-user.decorator';

/**
 * This controller provides publicly available information about someone
 * with an account
 *
 */
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private workoutPlanService: WorkoutPlanService,
  ) {}

  /**
   *
   * @param params
   */
  @Get('/:username')
  @UseGuards(AllowAnonymousJwtGuard)
  async findUserByUsername(@Param() params) {
    const { username } = params;
    try {
      const user = await this.userService.findOneByUsername(username);
      return UserProfileDto.createFromUser(user);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Finds all workout plans associated with an owner. If no authenticated owner
   * can be found, it returns all public workout plans of the owner. Otherwise,
   * also private and public workout plan will be returned.
   *
   * @param params
   * @param authUser
   * @param page
   * @param perPage
   */
  @Get('/:username/workoutplans')
  @UseGuards(AllowAnonymousJwtGuard)
  async findUserWorkoutPlans(
    @Param() params,
    @AuthUser() authUser,
    @Query('page') page = 1,
    @Query('per_page') perPage = 30,
  ) {
    perPage = perPage > 100 ? 100 : perPage;
    const { username } = params;
    try {
      const user = await this.userService.findOneByUsername(username);
      return await this.workoutPlanService.findAllByOwner(user, authUser, {
        page,
        limit: perPage,
      });
    } catch (e) {
      throw e;
    }
  }
}
