// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlanController } from './workout-plan.controller';
import { Workoutplan } from './workout-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workoutplan])],
  providers: [WorkoutPlanService],
  controllers: [WorkoutPlanController],
  exports: [],
})
export class WorkoutPlanModule {}
