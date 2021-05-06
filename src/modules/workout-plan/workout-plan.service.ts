import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutPlan } from './workout-plan.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { WorkoutPlanCollaboratorService } from '../workout-plan-collaborator/workout-plan-collaborator.service';
import { SearchWorkoutPlanDto } from './dto/search-workout-plan.dto';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private workoutPlanRepository: Repository<WorkoutPlan>,
    private workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  /**
   * Finds all public workout plans
   *
   * @param options
   * @param searchWorkoutPlanQuery
   */
  async findAllPublic(
    options: IPaginationOptions,
    searchWorkoutPlanQuery: SearchWorkoutPlanDto,
  ) {
    const ownerName = searchWorkoutPlanQuery.ownerName;
    const workoutPlanName = searchWorkoutPlanQuery.workoutPlanName;
    const query = await this.workoutPlanRepository.createQueryBuilder(
      'workoutPlan',
    );
    if (ownerName && workoutPlanName) {
      query.innerJoinAndSelect(
        'workoutPlan.owner',
        'owner',
        'owner.login = :ownerName AND workoutPlan.name = :workoutPlanName AND workoutPlan.isPrivate = :isPrivate',
        { ownerName, workoutPlanName, isPrivate: true },
      );
    } else if (workoutPlanName) {
      query.innerJoinAndSelect(
        'workoutPlan.owner',
        'owner',
        'workoutPlan.name = :workoutPlanName AND workoutPlan.isPrivate = :isPrivate',
        { workoutPlanName, isPrivate: true },
      );
    } else if (ownerName) {
      query.innerJoinAndSelect(
        'workoutPlan.owner',
        'owner',
        'owner.login = :ownerName AND workoutPlan.isPrivate = :isPrivate',
        { ownerName, isPrivate: true },
      );
    } else {
      query.innerJoinAndSelect(
        'workoutPlan.owner',
        'owner',
        'workoutPlan.isPrivate = :isPrivate',
        { isPrivate: false },
      );
    }
    const res = await paginate(query, options);
    return new Pagination(
      res.items.map((elem) => {
        return elem.createPublicWorkoutDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Finds all private and public workout plans of an authenticated user or
   * workout plans that the user has explicit access to.
   * Only call this service function if the user has been successfully authenticated
   *
   * @param userId
   * @param options
   */
  async findAllAccessibleByUser(userId: string, options: IPaginationOptions) {
    const collabWorkoutPlanIds = await this.workoutPlanCollaboratorService.findAllWorkoutPlanIdsForCollaborator(
      userId,
    );
    const res = await paginate<WorkoutPlan>(
      this.workoutPlanRepository,
      options,
      {
        where: [{ userId }, { id: In(collabWorkoutPlanIds) }],
        relations: ['owner'],
      },
    );
    return new Pagination(
      res.items.map((elem) => {
        return elem.createPrivateWorkoutDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Finds all public workout plans where the user id is the owner
   *
   * @param userId
   * @param options
   */
  async findAllPublicByUser(userId: string, options: IPaginationOptions) {
    const res = await paginate<WorkoutPlan>(
      this.workoutPlanRepository,
      options,
      {
        where: [{ userId, isPrivate: false }],
        relations: ['owner'],
      },
    );
    return new Pagination(
      res.items.map((elem) => {
        return elem.createPublicWorkoutDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Finds the workout plan according to id and returns it
   *
   * @param workoutPlanId
   */
  async findOneById(workoutPlanId: string) {
    const workoutPlan = await this.workoutPlanRepository.findOne({
      where: [{ id: workoutPlanId }],
      relations: ['owner'],
    });
    if (!workoutPlan) {
      throw new NotFoundException();
    }
    return workoutPlan.createPublicWorkoutDto();
  }

  /**
   * Finds the workout plan according to plan name and returns it
   *
   * @param workoutPlanName
   */
  async findOneByName(workoutPlanName: string) {
    const workoutPlan = await this.workoutPlanRepository.findOne({
      where: [{ name: workoutPlanName }],
      relations: ['owner'],
    });
    if (!workoutPlan) {
      throw new NotFoundException();
    }
    return workoutPlan.createPublicWorkoutDto();
  }

  /**
   * Finds the workout plan according to plan name and user id and returns it
   *
   * @param workoutPlanName
   * @param userId
   */
  async findOneByNameAndUserId(workoutPlanName: string, userId: string) {
    const workoutPlan = await this.workoutPlanRepository.findOne({
      where: [{ name: workoutPlanName, userId: userId }],
      relations: ['owner'],
    });
    if (!workoutPlan) {
      throw new NotFoundException();
    }
    return workoutPlan.createPublicWorkoutDto();
  }

  /**
   * Saves a workout plan with an owner to the database
   *
   * @param createWorkoutPlanDto
   * @param userId
   */
  async save(createWorkoutPlanDto: CreateWorkoutPlanDto, userId: bigint) {
    const user = this.workoutPlanRepository.create(createWorkoutPlanDto);
    user.userId = userId;
    await this.workoutPlanRepository.save(user);
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
   * @param workoutPlanId
   * @param userId
   */
  async update(
    updateWorkoutPlanDto: UpdateWorkoutPlanDto,
    workoutPlanId: number,
    userId: string,
  ) {
    const queryRes = await this.workoutPlanRepository
      .createQueryBuilder()
      .update(WorkoutPlan)
      .set(updateWorkoutPlanDto)
      .where({ id: workoutPlanId, userId: userId })
      .execute();
    if (queryRes.affected === 0) {
      throw new NotFoundException('Could not find a workout plan');
    }
    if (queryRes.affected > 1) {
      throw new InternalServerErrorException();
    }
    // not optimal, have to find another way of doing this in the future
    // -> two queries instead of one
    const workoutPlan = await this.workoutPlanRepository.findOne({
      where: [{ id: workoutPlanId }],
      relations: ['owner'],
    });
    if (!workoutPlan) throw new NotFoundException();
    return workoutPlan.createPublicWorkoutDto();
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
