// exercise.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { License } from '../license/license.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, License])],
  providers: [ExerciseService],
  controllers: [ExerciseController],
  exports: [],
})
export class ExerciseModule {}
