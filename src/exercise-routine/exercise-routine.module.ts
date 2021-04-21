import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseRoutine } from './exercise-routine.entity';
import { ExerciseRoutineController } from './exercise-routine.controller';
import { ExerciseRoutineService } from './exercise-routine.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseRoutine])],
  providers: [ExerciseRoutineService],
  controllers: [ExerciseRoutineController],
  exports: [],
})
export class ExerciseRoutineModule {}
