import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutplanModule } from './workoutplan/workoutplan.module';
import { MuscleGroupModule } from './musclegroup/muscle-group.module';
import { ExerciseModule } from './exercise/exercise.module';
import { LicenseModule } from './license/license.module';
import { WorkoutDayModule } from './workoutday/workout-day.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    WorkoutplanModule,
    MuscleGroupModule,
    ExerciseModule,
    LicenseModule,
    WorkoutDayModule,
  ],
})
export class AppModule {}
