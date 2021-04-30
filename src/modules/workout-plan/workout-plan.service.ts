import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutPlan } from './workout-plan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private workoutPlanRepository: Repository<WorkoutPlan>,
  ) {}

  /**
   * Finds all public workout plans
   *
   * @param options
   */
  async findAllPublic(options: IPaginationOptions) {
    const res = await paginate<WorkoutPlan>(
      this.workoutPlanRepository,
      options,
      {
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
   * @param userId
   * @param options
   */
  async findAllAccessibleByUser(userId: bigint, options: IPaginationOptions) {
    const res = await paginate<WorkoutPlan>(
      this.workoutPlanRepository,
      options,
      {
        where: [{ userId }],
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
  async findAllPublicByUser(userId: number, options: IPaginationOptions) {
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
  async findOneByNameAndUserId(workoutPlanName: string, userId: number) {
    const workoutPlan = await this.workoutPlanRepository.findOne({
      where: [{ name: workoutPlanName, userId }],
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
        'Could not find a workout plan with name: ' + workoutPlanName,
      );
    }
    if (queryRes.raw.length > 1) {
      throw new InternalServerErrorException();
    }
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
