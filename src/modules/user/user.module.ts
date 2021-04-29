import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMapper } from './mapper/user.mapper';
import { WorkoutPlanModule } from '../workout-plan/workout-plan.module';
import { WorkoutPlanService } from '../workout-plan/workout-plan.service';
import { WorkoutPlan } from '../workout-plan/workout-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, WorkoutPlan]),
    forwardRef(() => WorkoutPlanModule),
  ],
  providers: [UserService, UserMapper, WorkoutPlanService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
