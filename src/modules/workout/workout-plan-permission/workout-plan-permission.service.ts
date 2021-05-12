import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkoutPlanPermissionEntity } from './workout-plan-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkoutPlanPermissionService {
  constructor(
    @InjectRepository(WorkoutPlanPermissionEntity)
    private permissionRepository: Repository<WorkoutPlanPermissionEntity>,
  ) {}

  async findOneById(id: string) {
    return this.permissionRepository.findOne({ id });
  }

  async findOneByName(name: string) {
    return this.permissionRepository.findOne({ name });
  }
}
