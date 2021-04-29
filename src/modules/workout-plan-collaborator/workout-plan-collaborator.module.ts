import { Module } from '@nestjs/common';
import { WorkoutPlanCollaboratorService } from './workout-plan-collaborator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanCollaboratorEntity } from './workout-plan-collaborator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlanCollaboratorEntity])],
  providers: [WorkoutPlanCollaboratorService],
  exports: [WorkoutPlanCollaboratorService],
})
export class WorkoutPlanCollaboratorModule {}
