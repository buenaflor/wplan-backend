import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseRoutine } from './exercise-routine.entity';

@Injectable()
export class ExerciseRoutineService {
  constructor(
    @InjectRepository(ExerciseRoutine)
    private exerciseRoutineRepository: Repository<ExerciseRoutine>,
  ) {}

  findAll() {
    return this.exerciseRoutineRepository.find({
      relations: ['exercise', 'workoutDay', 'wlSets'],
    });
  }

  findOne(exerciseRoutineId: string) {
    return this.exerciseRoutineRepository.findOne({
      where: [{ id: exerciseRoutineId }],
      relations: ['exercise', 'workoutDay'],
    });
  }
}
