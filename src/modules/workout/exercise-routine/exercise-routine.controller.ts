import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ExerciseRoutineService } from './exercise-routine.service';
import { Routes } from '../../../config/constants';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { ExerciseRoutineId } from './decorator/exercise-routine-id.decorator';

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

  @Put(Routes.exerciseRoutine.put.one)
  @UseGuards(JwtAuthGuard)
  async updateExerciseRoutine(@ExerciseRoutineId() exerciseRoutineId: string) {}

  @Delete(Routes.exerciseRoutine.delete.one)
  @UseGuards(JwtAuthGuard)
  async deleteExerciseRoutine(@ExerciseRoutineId() exerciseRoutineId: string) {}
}
