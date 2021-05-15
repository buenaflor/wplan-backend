import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseRoutine } from './exercise-routine.entity';
import { ExerciseRoutineController } from './exercise-routine.controller';
import { ExerciseRoutineService } from './exercise-routine.service';
import { WorkoutDayAuthorizationService } from '../workout-day/service/workout-day-authorization.service';
import { CaslModule } from '../../../common/casl/casl.module';
import { WorkoutPlanCollaboratorModule } from '../workout-plan-collaborator/workout-plan-collaborator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExerciseRoutine]),
    CaslModule,
    WorkoutPlanCollaboratorModule,
  ],
  providers: [ExerciseRoutineService, WorkoutDayAuthorizationService],
  controllers: [ExerciseRoutineController],
  exports: [ExerciseRoutineService],
})
export class ExerciseRoutineModule {}
