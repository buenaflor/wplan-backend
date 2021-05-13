import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../../../config/constants';
import { WorkoutDayId } from './decorator/workout-day-id.decorator';
import { UpdateMultipleWorkoutDayDto } from './dto/request/update-workout-day.dto';
import { WorkoutDayService } from './service/workout-day.service';
import { AllowAnonymousJwtGuard } from '../../../guards/allow-anonymous-jwt-guard.service';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { AuthUser } from '../../auth-user/decorator/auth-user.decorator';
import { AuthUserDto } from '../../auth-user/dto/auth-user.dto';

@Controller(Routes.workoutDay.controller)
export class WorkoutDayController {
  constructor(private readonly workoutDayService: WorkoutDayService) {}

  /**
   * Returns one workout day by id
   *
   * @param req
   */
  @Get(Routes.workoutDay.get.one)
  @UseGuards(AllowAnonymousJwtGuard)
  async findOne(@Request() req: any) {
    return 'das';
  }

  /**
   * Updates the workout day according to workout the passed in body
   *
   * @param updateMultipleWorkoutDayDto
   * @param authUser
   */
  @Put(Routes.workoutDay.put.multiple)
  @UseGuards(JwtAuthGuard)
  async updateWorkoutDays(
    @Body()
    updateMultipleWorkoutDayDto: UpdateMultipleWorkoutDayDto,
    @AuthUser() authUser: AuthUserDto,
  ) {
    return await this.workoutDayService.updateMultiple(
      updateMultipleWorkoutDayDto.workoutDays,
      authUser,
    );
  }

  /**
   * Finds the workout day with id and deletes it
   *
   * @param workoutDayId
   * @param authUser
   */
  @Delete(Routes.workoutDay.delete.one)
  @HttpCode(204)
  async deleteWorkoutDay(
    @WorkoutDayId() workoutDayId: string,
    @AuthUser() authUser: AuthUserDto,
  ) {
    return this.workoutDayService.delete(workoutDayId, authUser);
  }
}
