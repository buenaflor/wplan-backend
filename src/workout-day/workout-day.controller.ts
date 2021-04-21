import { Controller, Get } from '@nestjs/common';
import { WorkoutDayService } from './workout-day.service';

@Controller('workoutdays')
export class WorkoutDayController {
  constructor(private readonly workoutDayService: WorkoutDayService) {}

  @Get()
  async findAll() {
    return await this.workoutDayService.findAll();
  }
}
