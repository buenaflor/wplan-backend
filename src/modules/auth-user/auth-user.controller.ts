import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { AuthUser } from '../user/decorator/auth-user.decorator';
import { PrivateUserDto } from '../user/dto/private-user.dto';
import { WorkoutPlanService } from '../workout-plan/workout-plan.service';

/**
 * This controller is responsible for handling authenticated user requests
 * Requests to this controller are only possible with an access token
 *
 */
@Controller('user')
export class AuthUserController {
  constructor(
    private userService: UserService,
    private workoutPlanService: WorkoutPlanService,
  ) {}

  /**
   * Returns publicly and privately available information of the authenticated user
   *
   * @param authUser
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedUser(@AuthUser() authUser): Promise<PrivateUserDto> {
    return await this.userService.findPrivateUserById(authUser.userId);
  }

  /**
   * Updates the user based on UpdateUserDto
   *
   * @param authUser
   * @param updateUserDto
   */
  @Patch()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateAuthenticatedUser(
    @AuthUser() authUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(updateUserDto, authUser.userId);
    // TODO: if changing email, verified changes to false, maybe with trigger?
  }

  /**
   * Returns public and private workout plans for the authenticated user
   *
   * @param authUser
   * @param page
   * @param perPage
   */
  @Get('workout_plans')
  @UseGuards(JwtAuthGuard)
  async getWorkoutPlans(
    @AuthUser() authUser,
    @Query('page') page = 1,
    @Query('per_page') perPage = 30,
  ) {
    return await this.workoutPlanService.findAllByAuthenticatedOwner(
      authUser.userId,
      {
        page,
        limit: perPage,
      },
    );
  }
}
