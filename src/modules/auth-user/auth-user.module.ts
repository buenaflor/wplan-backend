import { Module } from '@nestjs/common';
import { AuthUserController } from './auth-user.controller';
import { UserModule } from '../user/user.module';
import { WorkoutPlanModule } from '../workout/workout-plan/workout-plan.module';
import { WorkoutPlanCollaboratorModule } from '../workout/workout-plan-collaborator/workout-plan-collaborator.module';

@Module({
  imports: [UserModule, WorkoutPlanModule, WorkoutPlanCollaboratorModule],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
