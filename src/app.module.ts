import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanModule } from './modules/workout/workout-plan/workout-plan.module';
import { MuscleGroupModule } from './modules/workout/muscle-group/muscle-group.module';
import { ExerciseModule } from './modules/workout/exercise/exercise.module';
import { LicenseModule } from './modules/license/license.module';
import { WorkoutDayModule } from './modules/workout/workout-day/workout-day.module';
import { ExerciseRoutineModule } from './modules/workout/exercise-routine/exercise-routine.module';
import { ExerciseWlSetModule } from './modules/workout/exercise-wl-set/exercise-wl-set.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './common/auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { databaseConfig } from './common/database/database.config';
import { EmailVerificationModule } from './common/mail/verification/email-verification.module';
import { AuthUserModule } from './modules/auth-user/auth-user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/workout/role/role.module';
import { WorkoutPlanCollaboratorModule } from './modules/workout/workout-plan-collaborator/workout-plan-collaborator.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CaslModule } from './common/casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    ThrottlerModule.forRoot({
      // Time to live in seconds
      ttl: 60,
      // Limited number of requests in ttl
      limit: 20,
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
    EmailVerificationModule,
    AuthUserModule,
    PermissionModule,
    RoleModule,
    WorkoutPlanCollaboratorModule,
    CaslModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
