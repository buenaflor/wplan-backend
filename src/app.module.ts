import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutplanModule } from './workoutplan/workoutplan.module';
import { MusclegroupModule } from './musclegroup/musclegroup.module';
import { ExerciseModule } from './exercise/exercise.module';
import { LicenseModule } from './license/license.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    WorkoutplanModule,
    MusclegroupModule,
    ExerciseModule,
    LicenseModule,
  ],
})
export class AppModule {}
