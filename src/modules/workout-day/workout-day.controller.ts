import { Body, Controller, Delete, HttpCode, Patch } from '@nestjs/common';
import { Routes } from '../../config/constants';
import { WorkoutDayId } from './decorator/workout-day-id.decorator';
import { UpdateWorkoutDayDto } from './dto/update-workout-day.dto';
import { WorkoutDayService } from './workout-day.service';

@Controller(Routes.workoutDay.controller)
export class WorkoutDayController {
  constructor(private readonly workoutDayService: WorkoutDayService) {}

  /**
   * Returns one workout day by id
   *
   * @param workoutDayId
   */
  async findOne(@WorkoutDayId() workoutDayId: string) {
    return this.workoutDayService.findOneById(workoutDayId);
  }

  /**
   * Updates the workout day according to workout the passed in body
   *
   * @param workoutDayId
   * @param updateWorkoutDayDto
   */
  @Patch(Routes.workoutDay.patch.one)
  async updateWorkoutDay(
    @WorkoutDayId() workoutDayId: string,
    @Body() updateWorkoutDayDto: UpdateWorkoutDayDto,
  ) {
    updateWorkoutDayDto.id = workoutDayId;
    return this.workoutDayService.update(updateWorkoutDayDto);
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
