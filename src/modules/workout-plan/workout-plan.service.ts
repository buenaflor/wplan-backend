import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutPlan } from './workout-plan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { AuthUser } from '../user/decorator/auth-user.decorator';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { PrivateWorkoutPlanDto } from './dto/private-workout-plan.dto';
import { ObjectID } from "typeorm/driver/mongodb/typings";
import { FindConditions } from "typeorm/find-options/FindConditions";

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private workoutPlanRepository: Repository<WorkoutPlan>,
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

  verifyAccess(workoutPlan: WorkoutPlan, @AuthUser() authUser) {
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
    const paginatedWorkoutPlans = await paginate<WorkoutPlan>(
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
    const paginatedWorkoutPlans = await paginate<WorkoutPlan>(
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

  /**
   * Saves a workout plan with an owner to the database
   *
   * @param createWorkoutPlanDto
   */
  async save(createWorkoutPlanDto: CreateWorkoutPlanDto) {
    await this.workoutPlanRepository.save(createWorkoutPlanDto);
  }

  /**
   * Updates the specified workout plan with the data of updateWorkoutPlanDto
   *
   * Since updating a workout plan requires authentication, we can safely
   * return a private workout plan dto
   *
   * Note: returning('*') works for MS SQL Server or PostgreSQL
   *
   * @param updateWorkoutPlanDto
   * @param workoutPlanName
   * @param userId
   */
  async update(
    updateWorkoutPlanDto: UpdateWorkoutPlanDto,
    workoutPlanName: string,
    userId: bigint,
  ) {
    const queryRes = await this.workoutPlanRepository
      .createQueryBuilder()
      .update(WorkoutPlan)
      .set(updateWorkoutPlanDto)
      .where({ name: workoutPlanName, userId: userId })
      .returning('*')
      .execute();
    if (queryRes.raw.isEmpty) {
      throw new NotFoundException(
        'Could not find a workoutplan with name: ' + workoutPlanName,
      );
    }
    if (queryRes.raw.length > 1) {
      throw new InternalServerErrorException();
    }
    const workoutPlan: PrivateWorkoutPlanDto = queryRes.raw[0];
    return workoutPlan;
  }

  async delete(criteria: FindConditions<WorkoutPlan>) {
    const res = await this.workoutPlanRepository.delete(criteria);
    if (res.affected === 0) {
      throw new NotFoundException('Could not find workout plan');
    }
    if (res.affected > 1) {
      throw new InternalServerErrorException();
    }
  }
}
