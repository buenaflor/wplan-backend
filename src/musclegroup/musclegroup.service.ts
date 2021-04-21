import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Musclegroup } from './musclegroup.entity';

@Injectable()
export class MusclegroupService {
  constructor(
    @InjectRepository(Musclegroup)
    private musclegroupRepository: Repository<Musclegroup>,
  ) {}

  findAll() {
    return this.musclegroupRepository.find();
  }
}
