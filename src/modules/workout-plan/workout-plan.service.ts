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

  /**
   * Finds all private and public workout plans of an authenticated user.
   * Only call this service function if the user has been successfully authenticated
   *
   * @param ownerId
   * @param options
   */
  async findAllByAuthenticatedOwner(
    ownerId: bigint,
    options: IPaginationOptions,
  ) {
    const paginatedWorkoutPlans = await paginate<Workoutplan>(
      this.workoutPlanRepository,
      options,
      {
        where: [{ userId: ownerId }],
        relations: ['owner'],
      },
    );
    paginatedWorkoutPlans.items.map((elem) => {
      return elem.createPrivateWorkoutDto();
    });
    return paginatedWorkoutPlans;
  }

  /**
   * Finds all public workout plans associated with the owner
   *
   * @param ownerId
   * @param options
   */
  async findAllPublicByOwner(ownerId: bigint, options: IPaginationOptions) {
    const paginatedWorkoutPlans = await paginate<Workoutplan>(
      this.workoutPlanRepository,
      options,
      {
        where: [{ userId: ownerId, isPrivate: false }],
        relations: ['owner'],
      },
    );
    paginatedWorkoutPlans.items.map((elem) => {
      return elem.createPublicWorkoutDto();
    });
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
