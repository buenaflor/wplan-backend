import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseWlSet } from './exercise-wl-set.entity';

@Injectable()
export class ExerciseWlSetService {
  constructor(
    @InjectRepository(ExerciseWlSet)
    private exerciseWlSetRepository: Repository<ExerciseWlSet>,
  ) {}

  findAll() {
    return this.exerciseWlSetRepository.find({
      relations: ['exerciseRoutine'],
    });
  }
}
