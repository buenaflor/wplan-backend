import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../../../config/constants';
import { WorkoutDayId } from './decorator/workout-day-id.decorator';
import { UpdateWorkoutDayDto } from './dto/request/update-workout-day.dto';
import { WorkoutDayService } from './service/workout-day.service';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { AuthUser } from '../../auth-user/decorator/auth-user.decorator';
import { AuthUserDto } from '../../auth-user/dto/auth-user.dto';
import { MyLogger } from '../../../logging/my.logger';
import { OptionalJwtGuard } from '../../../guards/allow-anonymous-jwt-guard.service';
import { CreateExerciseRoutineDto } from '../exercise-routine/dto/request/create-exercise-routine.dto';

@Controller(Routes.workoutDay.controller)
export class WorkoutDayController {
  constructor(private readonly workoutDayService: WorkoutDayService) {}

  private readonly logger = new MyLogger(WorkoutDayController.name);

  /**
   * Updates the workout day according to workout the passed in body
   *
   * @param updateWorkoutDayDto
   * @param authUser
   */
  @Put(Routes.workoutDay.put.multiple)
  @UseGuards(JwtAuthGuard)
  async updateWorkoutDays(
    @Body()
    updateWorkoutDayDto: UpdateWorkoutDayDto,
    @AuthUser() authUser: AuthUserDto,
  ) {
    this.logger.log(`updateWorkoutDays(${authUser.username})`);
    return await this.workoutDayService.update(updateWorkoutDayDto, authUser);
  }

  /**
   * Finds the workout day with id and deletes it
   *
   * @param workoutDayId
   * @param authUser
   */
  @Delete(Routes.workoutDay.delete.one)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteWorkoutDay(
    @WorkoutDayId() workoutDayId: string,
    @AuthUser() authUser: AuthUserDto,
  ) {
    this.logger.log(`deleteWorkoutDay(${workoutDayId}, ${authUser.username})`);
    return this.workoutDayService.delete(workoutDayId, authUser);
  }

  @UseGuards(OptionalJwtGuard)
  @Get(Routes.workoutDay.exerciseRoutine.get.all)
  async getExerciseRoutines(
    @WorkoutDayId() workoutDayId: string,
    @AuthUser() authUser: AuthUserDto,
  ) {
    this.logger.log(
      `getExerciseRoutines(${workoutDayId}, ${authUser.username})`,
    );
  }

  @Post(Routes.workoutDay.exerciseRoutine.post.one)
  @UseGuards(JwtAuthGuard)
  async createExerciseRoutines(
    @WorkoutDayId() workoutDayId: string,
    @AuthUser() authUser: AuthUserDto,
    @Body() createExerciseRoutineDto: CreateExerciseRoutineDto,
  ) {
    this.logger.log(
      `createExerciseRoutines(${workoutDayId}, ${authUser.username})`,
    );
    console.log(createExerciseRoutineDto);
  }
}
