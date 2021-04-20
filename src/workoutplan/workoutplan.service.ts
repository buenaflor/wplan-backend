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
export class WorkoutplanService {
  constructor(
    @InjectRepository(Workoutplan)
    private workoutplanRepository: Repository<Workoutplan>,
  ) {}

  findOne(id: string): Promise<Workoutplan> {
    return this.workoutplanRepository.findOne(id);
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Workoutplan>> {
    return paginate<Workoutplan>(this.workoutplanRepository, options);
  }
}
