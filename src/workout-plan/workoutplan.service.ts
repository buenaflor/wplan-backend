import { Injectable } from '@nestjs/common';
import { Workoutplan } from './workoutplan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(Workoutplan)
    private workoutPlanRepository: Repository<Workoutplan>,
  ) {}

  async findOne(id: string): Promise<Workoutplan> {
    return this.workoutPlanRepository.findOne(id, {
      relations: [
        'workoutDays',
        'workoutDays.exerciseRoutines',
        'workoutDays.exerciseRoutines.exercise',
      ],
    });
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Workoutplan>> {
    return paginate<Workoutplan>(this.workoutPlanRepository, options);
  }
}
