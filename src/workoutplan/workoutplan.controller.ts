import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { WorkoutplanService } from './workoutplan.service';
import { Workoutplan } from './workoutplan.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('workoutplans')
export class WorkoutplanController {
  constructor(private readonly workoutplanService: WorkoutplanService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Workoutplan> {
    return await this.workoutplanService.findOne(id);
  }

  @Get()
  async index(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ): Promise<Pagination<Workoutplan>> {
    limit = limit > 20 ? 20 : limit;
    return this.workoutplanService.paginate({
      page,
      limit,
      route: 'http://localhost:4000/workoutplans',
    });
  }
}
