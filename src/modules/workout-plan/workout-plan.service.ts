import { Injectable, NotFoundException } from '@nestjs/common';
import { Workoutplan } from './workout-plan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { AuthUser } from '../user/decorator/auth-user.decorator';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(Workoutplan)
    private workoutPlanRepository: Repository<Workoutplan>,
  ) {}

  async findOneByNameAndOwnerId(workoutPlanName: string, ownerId: bigint) {
    const workoutPlan = await this.workoutPlanRepository.findOne({
      where: [{ name: workoutPlanName, userId: ownerId }],
      relations: ['owner'],
    });
    if (!workoutPlan) {
      throw new NotFoundException();
    }
    return workoutPlan;
  }

  verifyAccess(workoutPlan: Workoutplan, @AuthUser() authUser) {
    if (workoutPlan.isPrivate) {
      if (!authUser || workoutPlan.owner.username !== authUser.username)
        throw new NotFoundException();
    }
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
