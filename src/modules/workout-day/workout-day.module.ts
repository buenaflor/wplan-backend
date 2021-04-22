// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutDay } from './workout-day.entity';
import { WorkoutDayService } from './workout-day.service';
import { WorkoutDayController } from './workout-day.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutDay])],
  providers: [WorkoutDayService],
  controllers: [WorkoutDayController],
  exports: [],
})
export class WorkoutDayModule {}
