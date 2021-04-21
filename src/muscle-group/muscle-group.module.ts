// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuscleGroupController } from './muscle-group.controller';
import { MuscleGroupService } from './muscle-group.service';
import { MuscleGroup } from './muscle-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MuscleGroup])],
  providers: [MuscleGroupService],
  controllers: [MuscleGroupController],
  exports: [],
})
export class MuscleGroupModule {}
