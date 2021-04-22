import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseWlSet } from './exercise-wl-set.entity';
import { ExerciseWlSetService } from './exercise-wl-set.service';
import { ExerciseWlSetController } from './exercise-wl-set.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseWlSet])],
  providers: [ExerciseWlSetService],
  controllers: [ExerciseWlSetController],
  exports: [],
})
export class ExerciseWlSetModule {}
