import { Module } from '@nestjs/common';
import { AuthUserController } from './auth-user.controller';
import { UserModule } from '../user/user.module';
import { UserMapper } from '../user/mapper/user.mapper';
import { WorkoutPlanModule } from '../workout-plan/workout-plan.module';

@Module({
  imports: [UserModule, WorkoutPlanModule],
  providers: [UserMapper],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
