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
import { CreateExerciseRoutineBulkDto } from '../exercise-routine/dto/request/create-exercise-routine.dto';
import { ExerciseRoutineService } from '../exercise-routine/exercise-routine.service';

@Controller(Routes.workoutDay.controller)
export class WorkoutDayController {
  constructor(
    private readonly workoutDayService: WorkoutDayService,
    private readonly exerciseRoutineService: ExerciseRoutineService,
  ) {}

  private readonly logger = new MyLogger(WorkoutDayController.name);

  /**
   * Updates the workout day according to workout the passed in body
   *
   * @param workoutDayId
   * @param updateWorkoutDayDto
   * @param authUser
   */
  @Put(Routes.workoutDay.put.one)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateWorkoutDay(
    @WorkoutDayId() workoutDayId: string,
    @Body() updateWorkoutDayDto: UpdateWorkoutDayDto,
    @AuthUser() authUser: AuthUserDto,
  ) {
    this.logger.log(`updateWorkoutDay(${authUser.username})`);
    updateWorkoutDayDto.id = workoutDayId;
    await this.workoutDayService.update(updateWorkoutDayDto, authUser);
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
    this.logger.log(`deleteWorkoutDay(${workoutDayId}, ${authUser.username})`);
    return this.workoutDayService.delete(workoutDayId, authUser);
  }

  /**
   * Creates a batch of exercise routines for a workout day
   *
   * @param workoutDayId
   * @param authUser
   * @param createExerciseRoutineBulkDto
   */
  @Post(Routes.workoutDay.post.exerciseRoutine)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async createExerciseRoutines(
    @WorkoutDayId() workoutDayId: string,
    @AuthUser() authUser: AuthUserDto,
    @Body() createExerciseRoutineBulkDto: CreateExerciseRoutineBulkDto,
  ) {
    this.logger.log(`createExerciseRoutines()`);
    const workoutDay = await this.workoutDayService.findOneById(
      workoutDayId,
      authUser,
    );
    return this.exerciseRoutineService.save(
      workoutDayId,
      workoutDay.workoutPlanId,
      createExerciseRoutineBulkDto,
      authUser,
    );
  }

  @Put(Routes.workoutDay.put.exerciseRoutine)
  @HttpCode(204)
  async updateExerciseRoutines() {
    this.logger.log(`updateExerciseRoutines()`);
  }

  @Get(Routes.workoutDay.get.exerciseRoutine)
  @HttpCode(204)
  async getExerciseRoutines() {
    this.logger.log(`getExerciseRoutines()`);
  }
}
