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
import { AuthModule } from './shared/auth/auth.module';
import { AuthController } from './shared/auth/auth.controller';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { databaseConfig } from './shared/database/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    WorkoutPlanModule,
    MuscleGroupModule,
    ExerciseModule,
    LicenseModule,
    WorkoutDayModule,
    ExerciseRoutineModule,
    ExerciseWlSetModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AuthController],
})
export class AppModule {}
