import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkoutPlanService } from './workout-plan.service';
import { Workoutplan } from './workout-plan.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('workoutplans')
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req): Promise<Workoutplan> {
    const { id } = req.params;
    const userId = req.user.userId;
    return await this.workoutPlanService.findOne(id);
  }

  @Get()
  async index(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    limit = limit > 20 ? 20 : limit;
    return this.workoutPlanService.paginate({
      page,
      limit,
      route: 'http://localhost:4000/api/v1/workoutplans',
    });
  }
}
