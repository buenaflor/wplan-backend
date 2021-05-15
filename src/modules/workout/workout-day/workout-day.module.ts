// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutDay } from './workout-day.entity';
import { WorkoutDayService } from './service/workout-day.service';
import { WorkoutDayController } from './workout-day.controller';
import { CaslModule } from '../../../common/casl/casl.module';
import { WorkoutPlanCollaboratorModule } from '../workout-plan-collaborator/workout-plan-collaborator.module';
import { WorkoutDayAuthorizationService } from './service/workout-day-authorization.service';
import { ExerciseRoutineModule } from '../exercise-routine/exercise-routine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkoutDay]),
    CaslModule,
    WorkoutPlanCollaboratorModule,
    ExerciseRoutineModule,
  ],
  providers: [WorkoutDayService, WorkoutDayAuthorizationService],
  controllers: [WorkoutDayController],
  exports: [WorkoutDayService],
})
export class WorkoutDayModule {}
