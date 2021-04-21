import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuscleGroup } from './muscle-group.entity';

@Injectable()
export class MuscleGroupService {
  constructor(
    @InjectRepository(MuscleGroup)
    private workoutDayRepository: Repository<MuscleGroup>,
  ) {}

  findAll() {
    return this.workoutDayRepository.find();
  }
}
