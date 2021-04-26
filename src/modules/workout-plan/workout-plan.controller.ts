import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { WorkoutPlanService } from './workout-plan.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { WorkoutPlanMapper } from './mapper/workout-plan.mapper';

@Controller('workoutplans')
export class WorkoutPlanController {
  constructor(
    private readonly workoutPlanService: WorkoutPlanService,
    private readonly workoutPlanMapper: WorkoutPlanMapper,
  ) {}

  @Get('/:ownerName/:workoutPlanName')
  async findOne(@Param() params) {
    const { ownerName, workoutPlanName } = params;
    try {
      const workoutPlan = await this.workoutPlanService.findOneByNameAndOwner(
        workoutPlanName,
        ownerName,
      );
      const pL = this.workoutPlanMapper.workoutPlanEntityToDto(workoutPlan);
      console.log(pL);
      return pL;
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:username')
  async index(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Request() req,
  ) {
    console.log(req.params);
    limit = limit > 20 ? 20 : limit;
    return this.workoutPlanService.paginate({
      page,
      limit,
      route: 'http://localhost:4000/api/v1/workoutplans',
    });
  }
}
