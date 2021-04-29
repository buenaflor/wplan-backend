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
  Query,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutPlanService } from './workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from '../auth-user/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { Routes } from '../../config/constants';

@Controller(Routes.workoutPlan.controller)
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Get()
  async findAllPublic(
    @Query('page') page = 1,
    @Query('per_page') perPage = 30,
  ) {
    return await this.workoutPlanService.findAllPublic({
      page,
      limit: perPage,
    });
  }

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
  @Get(Routes.workoutPlan.get.one)
  @UseGuards(AllowAnonymousJwtGuard)
  async findOneForUser(@Param() params, @AuthUser() authUser) {
    const { ownerName, workoutPlanName } = params;
    const workoutPlanDto = await this.workoutPlanService.findOneByName(
      workoutPlanName,
    );
    if (authUser && authUser.userId === workoutPlanDto.owner.id) {
      return workoutPlanDto;
    }
    if (
      workoutPlanDto.owner.username !== ownerName ||
      workoutPlanDto.isPrivate
    ) {
      throw new NotFoundException();
    }
    return workoutPlanDto;
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
  @Patch(Routes.workoutPlan.patch.one)
  @HttpCode(204)
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
    await this.workoutPlanService.update(
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
  @Delete(Routes.workoutPlan.delete.one)
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
