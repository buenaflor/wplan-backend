// workout-plan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutDay } from './workout-day.entity';
import { WorkoutDayService } from './workout-day.service';
import { WorkoutDayController } from './workout-day.controller';
import { CaslModule } from '../../../common/casl/casl.module';
import { WorkoutPlanCollaboratorModule } from '../workout-plan-collaborator/workout-plan-collaborator.module';
import { WorkoutDayPolicyModule } from './policies/workout-day-policy,module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkoutDay]),
    CaslModule,
    WorkoutPlanCollaboratorModule,
    WorkoutDayPolicyModule,
  ],
  providers: [WorkoutDayService],
  controllers: [WorkoutDayController],
  exports: [WorkoutDayService],
})
export class WorkoutDayModule {}
