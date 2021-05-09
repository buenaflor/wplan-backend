import { Controller, Get, Param } from '@nestjs/common';
import { ExerciseRoutineService } from './exercise-routine.service';
import { Routes } from '../../../config/constants';

@Controller(Routes.exerciseRoutine.controller)
export class ExerciseRoutineController {
  constructor(
    private readonly exerciseRoutineService: ExerciseRoutineService,
  ) {}

  @Get(Routes.exerciseRoutine.get.one)
  async findOne(@Param() params) {
    const exerciseRoutineId = params.exerciseRoutineId;
    return await this.exerciseRoutineService.findOne(exerciseRoutineId);
  }
}
