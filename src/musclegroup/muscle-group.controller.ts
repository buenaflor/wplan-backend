import { Controller, Get } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';

@Controller('musclegroups')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Get()
  async findAll() {
    return await this.muscleGroupService.findAll();
  }
}
