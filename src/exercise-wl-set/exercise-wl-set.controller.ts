import { Controller, Get } from '@nestjs/common';
import { ExerciseWlSetService } from './exercise-wl-set.service';

@Controller('exercisewlsets')
export class ExerciseWlSetController {
  constructor(private readonly exerciseWlSetService: ExerciseWlSetService) {}

  @Get()
  async findAll() {
    return await this.exerciseWlSetService.findAll();
  }
}
