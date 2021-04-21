import { Controller, Get } from '@nestjs/common';
import { MusclegroupService } from './musclegroup.service';

@Controller('musclegroups')
export class MusclegroupController {
  constructor(private readonly musclegroupService: MusclegroupService) {}

  @Get()
  async findAll() {
    return await this.musclegroupService.findAll();
  }
}
