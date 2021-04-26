// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlanController } from './workout-plan.controller';
import { Workoutplan } from './workout-plan.entity';
import { WorkoutPlanMapper } from './mapper/workout-plan.mapper';
import { UserMapper } from '../user/mapper/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Workoutplan])],
  providers: [WorkoutPlanService, WorkoutPlanMapper, UserMapper],
  controllers: [WorkoutPlanController],
  exports: [],
})
export class WorkoutPlanModule {}
