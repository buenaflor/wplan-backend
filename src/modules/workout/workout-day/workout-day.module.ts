// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutDay } from './workout-day.entity';
import { WorkoutDayService } from './workout-day.service';
import { WorkoutDayController } from './workout-day.controller';
import { CaslModule } from '../../../common/casl/casl.module';
import { WorkoutPlanCollaboratorModule } from '../workout-plan-collaborator/workout-plan-collaborator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkoutDay]),
    CaslModule,
    WorkoutPlanCollaboratorModule,
  ],
  providers: [WorkoutDayService],
  controllers: [WorkoutDayController],
  exports: [WorkoutDayService],
})
export class WorkoutDayModule {}
