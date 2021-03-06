import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutDay } from '../workout-day.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateWorkoutDayDto } from '../dto/request/create-workout-day.dto';
import { UpdateWorkoutDayDto } from '../dto/request/update-workout-day.dto';
import { AuthUserDto } from '../../../auth-user/dto/auth-user.dto';
import { WorkoutDayAuthorizationService } from './workout-day-authorization.service';

@Injectable()
export class WorkoutDayService {
  constructor(
    @InjectRepository(WorkoutDay)
    private workoutDayRepository: Repository<WorkoutDay>,
    private workoutDayAuthorizationService: WorkoutDayAuthorizationService,
  ) {}

  /**
   * Retrieves all workout days associated with the workout plan id
   *
   * @param workoutPlanId
   * @param options
   * @param authUser
   */
  async findAll(
    workoutPlanId: string,
    options: IPaginationOptions,
    authUser: AuthUserDto,
  ) {
    const userId = authUser.userId;
    const authorized = await this.workoutDayAuthorizationService.authorizeRead(
      workoutPlanId,
      userId,
    );
    if (!authorized) throw new ForbiddenException();
    const res = await paginate<WorkoutDay>(this.workoutDayRepository, options, {
      where: [{ workoutPlanId }],
      relations: [
        'workoutPlan',
        'workoutPlan.owner',
        //'exerciseRoutines',
        //'exerciseRoutines.exercise',
        //'exerciseRoutines.sets',
      ],
    });
    return new Pagination(
      res.items.map((elem) => {
        return elem.toDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Finds a workout day with the id
   *
   * @param workoutDayId
   * @param authUser
   */
  async findOneById(workoutDayId: string, authUser: AuthUserDto) {
    // We have to get the workout day first in order to get the workout plan
    // it belongs to
    const res = await this.workoutDayRepository.findOne({
      where: [{ id: workoutDayId }],
    });
    const workoutPlanId = res.workoutPlan.id;
    const userId = authUser.userId;
    const authorized = await this.workoutDayAuthorizationService.authorizeRead(
      workoutPlanId,
      userId,
    );
    if (!authorized) throw new ForbiddenException();
    if (!res) throw new NotFoundException();
    return res.toDto();
  }

  /**
   * Updates multiple workout dtos
   *
   * @param updateWorkoutDayDto
   * @param user
   */
  async update(updateWorkoutDayDto: UpdateWorkoutDayDto, user: AuthUserDto) {
    const userId = user.userId;
    const workoutPlanId = updateWorkoutDayDto.workoutPlanId;
    const authorized = await this.workoutDayAuthorizationService.authorizeWrite(
      workoutPlanId,
      userId,
    );
    if (!authorized) throw new ForbiddenException();
    const savedWorkoutDays = await this.workoutDayRepository.save(
      updateWorkoutDayDto,
    );
    return savedWorkoutDays.toDto();
  }

  /**
   * Deletes a workout day from a workout plan
   *
   * @param workoutDayId
   * @param authUser
   */
  async delete(workoutDayId: string, authUser: AuthUserDto) {
    // We have to get the workout day first in order to get the workout plan
    // it belongs to
    const resFindOne = await this.workoutDayRepository.findOne({
      where: [{ id: workoutDayId }],
    });
    const workoutPlanId = resFindOne.workoutPlanId;
    const userId = authUser.userId;
    const authorized = await this.workoutDayAuthorizationService.authorizeDelete(
      workoutPlanId,
      userId,
    );
    if (!authorized) throw new ForbiddenException();
    const res = await this.workoutDayRepository.delete(workoutDayId);
    if (res.affected === 0) {
      throw new InternalServerErrorException('No entity was deleted');
    }
    if (res.affected > 1) {
      throw new InternalServerErrorException('More than one deleted');
    }
  }

  /**
   * Saves a create workout day dto to the database
   *
   * @param createWorkoutDayDto
   * @param authUser
   */
  async save(createWorkoutDayDto: CreateWorkoutDayDto, authUser: AuthUserDto) {
    const workoutPlanId = createWorkoutDayDto.workoutPlanId;
    const userId = authUser.userId;
    const authorized = await this.workoutDayAuthorizationService.authorizeRead(
      workoutPlanId,
      userId,
    );
    if (!authorized) throw new ForbiddenException();
    const entity = new WorkoutDay(createWorkoutDayDto);
    const res = await this.workoutDayRepository.save(entity);
    return await this.findOneById(res.id, authUser);
  }
}
