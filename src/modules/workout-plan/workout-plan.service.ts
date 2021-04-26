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
import { User } from '../user/user.entity';
import { log } from 'util';

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

  findAllPublicByOwner(owner: User, options: IPaginationOptions) {
    return paginate<Workoutplan>(this.workoutPlanRepository, options, {
      where: [{ userId: owner.id, isPrivate: false }],
      relations: ['owner'],
    });
  }

  findAllPublicAndPrivateByOwner(owner: User, options: IPaginationOptions) {
    return paginate<Workoutplan>(this.workoutPlanRepository, options, {
      where: [{ userId: owner.id }],
      relations: ['owner'],
    });
  }

  /**
   * Finds all workoutplans associated with the owner, if the authenticated owner is
   * available, private workout plans will also be shown
   *
   * @param owner
   * @param authUser
   * @param options
   */
  async findAllByOwner(
    owner: User,
    @AuthUser() authUser,
    options: IPaginationOptions,
  ) {
    let paginatedWorkoutPlans;
    if (authUser && authUser.username === owner.username) {
      paginatedWorkoutPlans = await this.findAllPublicAndPrivateByOwner(
        owner,
        options,
      );
    } else {
      paginatedWorkoutPlans = await this.findAllPublicByOwner(owner, options);
    }
    return paginatedWorkoutPlans;
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
