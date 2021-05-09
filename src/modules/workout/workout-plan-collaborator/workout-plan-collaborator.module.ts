import { Module } from '@nestjs/common';
import { WorkoutPlanCollaboratorService } from './workout-plan-collaborator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanCollaboratorEntity } from './workout-plan-collaborator.entity';
import { WorkoutPlanCollaboratorInvitationEntity } from './invitation/workout-plan-collaborator-invitation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkoutPlanCollaboratorEntity,
      WorkoutPlanCollaboratorInvitationEntity,
    ]),
  ],
  providers: [WorkoutPlanCollaboratorService],
  exports: [WorkoutPlanCollaboratorService],
})
export class WorkoutPlanCollaboratorModule {}
