import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseArrayPipe,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../../../config/constants';
import { WorkoutDayId } from './decorator/workout-day-id.decorator';
import { UpdateWorkoutDayDto } from './dto/request/update-workout-day.dto';
import { WorkoutDayService } from './workout-day.service';
import { AllowAnonymousJwtGuard } from '../../../guards/allow-anonymous-jwt-guard.service';
import { ReadWorkoutDayPolicyHandler } from './policies/read-workout-day-policy.handler';
import { CheckPolicies } from '../../../common/policy/check-policies.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { UpdateUserDto } from '../../user/dto/request/update-user.dto';
import { UpdateWorkoutDayPolicyHandler } from './policies/update-workout-day-policy.handler';
import {
  WorkoutDayAction,
  WorkoutDayPolicyFactory,
} from './policies/workout-day-policy.factory';
import { AuthUser } from '../../auth-user/decorator/auth-user.decorator';
import { AuthUserDto } from '../../auth-user/dto/auth-user.dto';

@Controller(Routes.workoutDay.controller)
export class WorkoutDayController {
  constructor(
    private readonly workoutDayService: WorkoutDayService,
    private readonly workoutDayPolicyFactory: WorkoutDayPolicyFactory,
  ) {}

  /**
   * Returns one workout day by id
   *
   * @param req
   */
  @Get(Routes.workoutDay.get.one)
  @UseGuards(AllowAnonymousJwtGuard)
  async findOne(@Request() req: any) {
    return req.workoutDay;
  }

  /**
   * Updates the workout day according to workout the passed in body
   *
   * @param updateWorkoutDayDtos
   * @param authUser
   */
  @Put(Routes.workoutDay.put.multiple)
  @UseGuards(JwtAuthGuard)
  @CheckPolicies(new UpdateWorkoutDayPolicyHandler())
  async updateWorkoutDays(
    @Body(new ParseArrayPipe({ items: UpdateUserDto }))
    updateWorkoutDayDtos: [UpdateWorkoutDayDto],
    @AuthUser() authUser: AuthUserDto,
  ) {
    await this.workoutDayService.updateMultiple(updateWorkoutDayDtos, authUser);
    // TODO: validate if all available ids are the same
  }

  /**
   * Finds the workout day with id and deletes it
   *
   * @param workoutDayId
   */
  @Delete(Routes.workoutDay.delete.one)
  @HttpCode(204)
  async deleteWorkoutDay(@WorkoutDayId() workoutDayId: string) {
    return this.workoutDayService.delete(workoutDayId);
  }
}
