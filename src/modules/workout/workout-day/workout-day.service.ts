import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutDay } from './workout-day.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateWorkoutDayDto } from './dto/request/create-workout-day.dto';
import { UpdateWorkoutDayDto } from './dto/request/update-workout-day.dto';

@Injectable()
export class WorkoutDayService {
  constructor(
    @InjectRepository(WorkoutDay)
    private workoutDayRepository: Repository<WorkoutDay>,
  ) {}

  /**
   * Retrieves all workout days associated with the workout plan id
   *
   * @param workoutPlanId
   * @param options
   */
  async findAll(workoutPlanId: string, options: IPaginationOptions) {
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
   */
  async findOneById(workoutDayId: string) {
    const res = await this.workoutDayRepository.findOne({
      where: [{ id: workoutDayId }],
      relations: ['workoutPlan', 'workoutPlan.owner'],
    });
    if (!res) throw new NotFoundException();
    return res.toDto();
  }

  /**
   * Updates the workout day entity and returns it
   *
   * @param updateWorkoutDayDto
   */
  async update(updateWorkoutDayDto: UpdateWorkoutDayDto) {
    const workoutDay = await this.workoutDayRepository.preload(
      updateWorkoutDayDto,
    );
    if (!workoutDay) {
      throw new NotFoundException('Could not find workout day');
    }
    const res = await this.workoutDayRepository.save(workoutDay);
    return res.toDto();
  }

  async delete(workoutPlanId: string) {
    const res = await this.workoutDayRepository.delete(workoutPlanId);
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
   */
  async save(createWorkoutDayDto: CreateWorkoutDayDto) {
    const entity = new WorkoutDay(createWorkoutDayDto);
    const res = await this.workoutDayRepository.save(entity);
    return this.findOneById(res.id);
  }
}
