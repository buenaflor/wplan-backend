import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ExerciseRoutine } from './exercise-routine.entity';
import { CreateExerciseRoutineBulkDto } from './dto/request/create-exercise-routine.dto';
import { AuthUserDto } from '../../auth-user/dto/auth-user.dto';
import { WorkoutDayAuthorizationService } from '../workout-day/service/workout-day-authorization.service';
import { WorkoutDayService } from '../workout-day/service/workout-day.service';

@Injectable()
export class ExerciseRoutineService {
  constructor(
    @InjectRepository(ExerciseRoutine)
    private exerciseRoutineRepository: Repository<ExerciseRoutine>,
    private workoutAuthorizationService: WorkoutDayAuthorizationService,
    private connection: Connection,
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

  async save(
    workoutDayId: string,
    workoutPlanId: string,
    createExerciseRoutineBulkDto: CreateExerciseRoutineBulkDto,
    authUser: AuthUserDto,
  ) {
    // Authorization

    const exerciseRoutines = createExerciseRoutineBulkDto.exerciseRoutines.map(
      async (elem) => {
        elem.workoutDayId = workoutDayId;
        return this.exerciseRoutineRepository.create(elem);
      },
    );
    await this.connection.transaction(async (manager) => {
      for (const exerciseRoutine of exerciseRoutines) {
        await manager.save<ExerciseRoutine>(await exerciseRoutine);
      }
    });
  }
}
