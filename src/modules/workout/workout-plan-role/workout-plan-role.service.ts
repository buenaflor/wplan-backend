import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkoutPlanRoleEntity } from './workout-plan-role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkoutPlanRoleService {
  constructor(
    @InjectRepository(WorkoutPlanRoleEntity)
    private roleRepository: Repository<WorkoutPlanRoleEntity>,
  ) {}

  async findOneById(id: string) {
    return this.roleRepository.findOne({ id });
  }

  async findOneByName(name: string) {
    return this.roleRepository.findOne({ name });
  }
}
