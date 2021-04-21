// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanService } from './workoutplan.service';
import { WorkoutplanController } from './workoutplan.controller';
import { Workoutplan } from './workoutplan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workoutplan])],
  providers: [WorkoutPlanService],
  controllers: [WorkoutplanController],
  exports: [],
})
export class WorkoutplanModule {}
