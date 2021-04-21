// workoutplan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusclegroupController } from './musclegroup.controller';
import { MusclegroupService } from './musclegroup.service';
import { Musclegroup } from './musclegroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Musclegroup])],
  providers: [MusclegroupService],
  controllers: [MusclegroupController],
  exports: [],
})
export class MusclegroupModule {}
