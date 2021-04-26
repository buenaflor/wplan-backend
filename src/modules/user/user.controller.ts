import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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
   * User Profile GET endpoint that should be accessible without access token
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

  @Get('/:username/workoutplans')
  @UseGuards(AllowAnonymousJwtGuard)
  async findUserWorkoutPlans(@Param() params, @AuthUser() authUser) {
    const { username } = params;
    console.log(authUser);
    try {
      let workoutPlans;
      const user = await this.userService.findOneByUsername(username);
      if (authUser && authUser.username === user.username) {
        workoutPlans = await this.workoutPlanService.findAllPublicAndPrivateByOwner(
          user,
        );
      } else {
        workoutPlans = await this.workoutPlanService.findAllPublicByOwner(user);
      }
      return workoutPlans;
    } catch (e) {
      throw e;
    }
  }
}
