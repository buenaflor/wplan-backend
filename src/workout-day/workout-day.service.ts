import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutDay } from './workout-day.entity';

@Injectable()
export class WorkoutDayService {
  constructor(
    @InjectRepository(WorkoutDay)
    private workoutDayRepository: Repository<WorkoutDay>,
  ) {}

  async findAll() {
    return this.workoutDayRepository.find({
      relations: [
        'workoutPlan',
        'exerciseRoutines',
        'exerciseRoutines.exercise',
      ],
    });
  }
}
