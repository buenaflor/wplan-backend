import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutplanModule } from './workout-plan/workoutplan.module';
import { MuscleGroupModule } from './muscle-group/muscle-group.module';
import { ExerciseModule } from './exercise/exercise.module';
import { LicenseModule } from './license/license.module';
import { WorkoutDayModule } from './workout-day/workout-day.module';
import { ExerciseRoutineModule } from './exercise-routine/exercise-routine.module';
import { ExerciseWlSetModule } from './exercise-wl-set/exercise-wl-set.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    WorkoutplanModule,
    MuscleGroupModule,
    ExerciseModule,
    LicenseModule,
    WorkoutDayModule,
    ExerciseRoutineModule,
    ExerciseWlSetModule,
  ],
})
export class AppModule {}
