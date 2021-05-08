// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutDay } from './workout-day.entity';
import { WorkoutDayService } from './workout-day.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutDay])],
  providers: [WorkoutDayService],
  controllers: [],
  exports: [WorkoutDayService],
})
export class WorkoutDayModule {}
