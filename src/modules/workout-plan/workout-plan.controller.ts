import {
  Controller,
  Get,
  UseGuards,
  Param,
  Patch,
  Body,
  UnauthorizedException,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { WorkoutPlanService } from './workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { UserService } from '../user/user.service';
import { AuthUser } from '../user/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';

@Controller('workoutplans')
export class WorkoutPlanController {
  constructor(
    private readonly workoutPlanService: WorkoutPlanService,
    private readonly userService: UserService,
  ) {}

  /**
   * Finds one workout plan matching the parameters
   * If the workout plan is private, the unauthenticated recipient
   * will always receive a 404 Not Found error
   *
   * Otherwise, the authenticated owner of the workout plan, will be able
   * to fetch the resource
   *
   * @param params
   * @param authUser
   */
  @Get('/:ownerName/:workoutPlanName')
  @UseGuards(AllowAnonymousJwtGuard)
  async findOneForUser(@Param() params, @AuthUser() authUser) {
    const { ownerName, workoutPlanName } = params;
    try {
      const user = await this.userService.findPublicUserByUsername(ownerName);
      const workoutPlan = await this.workoutPlanService.findOneByNameAndOwnerId(
        workoutPlanName,
        user.id,
      );
      this.workoutPlanService.verifyAccess(workoutPlan, authUser);
      return workoutPlan.createPublicWorkoutDto();
    } catch (e) {
      throw e;
    }
  }

  /**
   * Updates the workout plan according to updateWorkoutPlanDto and
   * the given params. An authenticated user and a valid workout plan name
   * is required.
   *
   * @param authUser
   * @param params
   * @param updateWorkoutPlanDto
   */
  @Patch('/:ownerName/:workoutPlanName')
  @UseGuards(JwtAuthGuard)
  async updateWorkoutPlanForUser(
    @AuthUser() authUser,
    @Param() params,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    const { ownerName, workoutPlanName } = params;
    const { username, userId } = authUser;
    if (ownerName !== username) {
      throw new UnauthorizedException();
    }
    return await this.workoutPlanService.update(
      updateWorkoutPlanDto,
      workoutPlanName,
      userId,
    );
  }

  /**
   * Deletes the workout plan according to the given params
   * An authenticated user and a valid workout plan name is required
   *
   * If the user does not have permission, a not authorized error will be thrown
   *
   * @param authUser
   * @param params
   */
  @Delete('/:ownerName/:workoutPlanName')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteWorkoutPlanForUser(@AuthUser() authUser, @Param() params) {
    const { ownerName, workoutPlanName } = params;
    const { username } = authUser;
    if (ownerName !== username) {
      throw new UnauthorizedException();
    }
    await this.workoutPlanService.delete({ name: workoutPlanName });
  }
}
