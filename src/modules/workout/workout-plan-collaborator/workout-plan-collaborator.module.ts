import { Module } from '@nestjs/common';
import { WorkoutPlanCollaboratorService } from './workout-plan-collaborator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlanCollaboratorEntity } from './workout-plan-collaborator.entity';
import { WorkoutPlanCollaboratorInvitationEntity } from './invitation/workout-plan-collaborator-invitation.entity';
import { CaslModule } from '../../../common/casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkoutPlanCollaboratorEntity,
      WorkoutPlanCollaboratorInvitationEntity,
    ]),
    CaslModule,
  ],
  providers: [WorkoutPlanCollaboratorService],
  exports: [WorkoutPlanCollaboratorService],
})
export class WorkoutPlanCollaboratorModule {}
