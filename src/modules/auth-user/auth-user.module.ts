import { Module } from '@nestjs/common';
import { AuthUserController } from './auth-user.controller';
import { UserModule } from '../user/user.module';
import { UserMapper } from '../user/mapper/user.mapper';
import { WorkoutPlanModule } from '../workout-plan/workout-plan.module';
import { WorkoutPlanCollaboratorModule } from '../workout-plan-collaborator/workout-plan-collaborator.module';

@Module({
  imports: [UserModule, WorkoutPlanModule, WorkoutPlanCollaboratorModule],
  providers: [UserMapper],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
