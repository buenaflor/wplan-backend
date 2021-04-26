import { Injectable, NotFoundException } from '@nestjs/common';
import { Workoutplan } from './workout-plan.entity';
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
        'workoutDays.exerciseRoutines.wlSets',
      ],
    });
  }

  async findOneByNameAndOwner(
    workoutPlanName: string,
    ownerName: string,
  ): Promise<Workoutplan> {
    const workoutPlan = await this.workoutPlanRepository.findOne({
      where: [{ name: workoutPlanName }],
      relations: ['owner'],
    });
    if (
      workoutPlan &&
      workoutPlan.owner.username === ownerName &&
      !workoutPlan.isPrivate
    ) {
      return workoutPlan;
    }
    throw new NotFoundException('Could not find resource');
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Workoutplan>> {
    const queryBuilder = await this.workoutPlanRepository
      .createQueryBuilder('workoutPlan')
      .leftJoinAndSelect('workoutPlan.workoutDays', 'workoutDays')
      .leftJoinAndSelect('workoutDays.exerciseRoutines', 'exerciseRoutines')
      .leftJoinAndSelect('exerciseRoutines.exercise', 'exercise')
      .leftJoinAndSelect('exerciseRoutines.wlSets', 'wlSets');
    return paginate<Workoutplan>(queryBuilder, options);
  }
}
