import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutPlan } from '../workout-plan.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateWorkoutPlanDto } from '../dto/request/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from '../dto/request/update-workout-plan.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { WorkoutPlanCollaboratorService } from '../../workout-plan-collaborator/workout-plan-collaborator.service';
import { SearchWorkoutPlanDto } from '../dto/request/search-workout-plan.dto';
import { AuthUserDto } from '../../../auth-user/dto/auth-user.dto';
import { WorkoutPlanAuthorizationService } from './workout-plan-authorization.service';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private workoutPlanRepository: Repository<WorkoutPlan>,
    private workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
    private workoutPlanAuthorizationService: WorkoutPlanAuthorizationService,
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
   * Finds all public workout plans where the user id is the owner
   *
   * @param options
   * @param userId
   */
  async findAllPublicByUser(options: IPaginationOptions, userId: string) {
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
   * Finds all private and public workout plans of an authenticated user or
   * workout plans that the user has explicit access to.
   * Only call this service function if the user has been successfully authenticated
   *
   * @param authUser
   * @param options
   */
  async findAllAccessibleByUser(
    authUser: AuthUserDto,
    options: IPaginationOptions,
  ) {
    const userId = authUser.userId;
    const collabWorkoutPlanIds = await this.workoutPlanCollaboratorService.findAllWorkoutPlanIdsForCollaborator(
      authUser,
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
   * @param authUser
   */
  async findOneById(workoutPlanId: string, authUser: AuthUserDto) {
    const workoutPlan = await this.workoutPlanRepository.findOne({
      where: [{ id: workoutPlanId }],
      relations: ['owner'],
    });
    const authorized = await this.workoutPlanAuthorizationService.authorizeRead(
      workoutPlan,
      authUser,
    );
    if (!authorized) throw new ForbiddenException();
    if (!workoutPlan) {
      throw new NotFoundException();
    }
    return workoutPlan.createPublicWorkoutDto();
  }

  /**
   * Saves a workout plan with an owner to the database
   *
   * @param createWorkoutPlanDto
   * @param authUser
   */
  async save(
    createWorkoutPlanDto: CreateWorkoutPlanDto,
    authUser: AuthUserDto,
  ) {
    const userId = authUser.userId;
    const workoutPlan = this.workoutPlanRepository.create(createWorkoutPlanDto);
    workoutPlan.userId = userId;
    await this.workoutPlanRepository.save(workoutPlan);
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
   * @param authUser
   */
  async update(
    updateWorkoutPlanDto: UpdateWorkoutPlanDto,
    workoutPlanId: string,
    authUser: AuthUserDto,
  ) {
    const userId = authUser.userId;
    const authorized = await this.workoutPlanAuthorizationService.authorizeWrite(
      workoutPlanId,
      userId,
    );
    if (!authorized) throw new ForbiddenException();
    const queryRes = await this.workoutPlanRepository
      .createQueryBuilder()
      .update(WorkoutPlan)
      .set(updateWorkoutPlanDto)
      .where({ id: workoutPlanId })
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

  async delete(workoutPlanId: string, authUser: AuthUserDto) {
    const authorized = await this.workoutPlanAuthorizationService.authorizeDelete(
      workoutPlanId,
      authUser.userId,
    );
    if (!authorized)
      throw new ForbiddenException(
        'Must have admin rights to the workout plan',
      );
    const res = await this.workoutPlanRepository.delete(workoutPlanId);
    if (res.affected === 0) {
      throw new NotFoundException('Could not find workout plan');
    }
    if (res.affected > 1) {
      throw new InternalServerErrorException();
    }
  }
}
