import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanModule } from './modules/workout-plan/workout-plan.module';
import { MuscleGroupModule } from './modules/muscle-group/muscle-group.module';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { LicenseModule } from './modules/license/license.module';
import { WorkoutDayModule } from './modules/workout-day/workout-day.module';
import { ExerciseRoutineModule } from './modules/exercise-routine/exercise-routine.module';
import { ExerciseWlSetModule } from './modules/exercise-wl-set/exercise-wl-set.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    WorkoutPlanModule,
    MuscleGroupModule,
    ExerciseModule,
    LicenseModule,
    WorkoutDayModule,
    ExerciseRoutineModule,
    ExerciseWlSetModule,
    UserModule,
  ],
})
export class AppModule {}
