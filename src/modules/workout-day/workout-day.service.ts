import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutDay } from './workout-day.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

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
        'exerciseRoutines',
        'exerciseRoutines.exercise',
        'exerciseRoutines.sets',
      ],
    });
    return new Pagination(
      res.items.map((elem) => {
        return elem.createWorkoutDayDto();
      }),
      res.meta,
      res.links,
    );
  }
}
