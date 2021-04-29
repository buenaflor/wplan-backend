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
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { databaseConfig } from './shared/database/database.config';
import { EmailVerificationModule } from './shared/mail/verification/email-verification.module';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { AuthUserModule } from './modules/auth-user/auth-user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { WorkoutPlanCollaboratorModule } from './modules/workout-plan-collaborator/workout-plan-collaborator.module';

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
    EmailVerificationModule,
    UserProfileModule,
    AuthUserModule,
    PermissionModule,
    RoleModule,
    WorkoutPlanCollaboratorModule,
  ],
})
export class AppModule {}
