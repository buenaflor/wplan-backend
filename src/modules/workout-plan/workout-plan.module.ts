// workout-plan.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlanController } from './workout-plan.controller';
import { Workoutplan } from './workout-plan.entity';
import { UserMapper } from '../user/mapper/user.mapper';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workoutplan]),
    forwardRef(() => UserModule),
  ],
  providers: [WorkoutPlanService, UserMapper],
  controllers: [WorkoutPlanController],
  exports: [],
})
export class WorkoutPlanModule {}
