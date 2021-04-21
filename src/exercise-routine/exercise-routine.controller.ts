import { Controller, Get } from '@nestjs/common';
import { ExerciseRoutineService } from './exercise-routine.service';

@Controller('exerciseroutines')
export class ExerciseRoutineController {
  constructor(
    private readonly exerciseRoutineService: ExerciseRoutineService,
  ) {}

  @Get()
  async findAll() {
    return await this.exerciseRoutineService.findAll();
  }
}
