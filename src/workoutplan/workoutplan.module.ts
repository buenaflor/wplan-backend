// workoutplan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutplanService } from './workoutplan.service';
import { WorkoutplanController } from './workoutplan.controller';
import { Workoutplan } from './workoutplan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workoutplan])],
  providers: [WorkoutplanService],
  controllers: [WorkoutplanController],
  exports: [],
})
export class WorkoutplanModule {}
