import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkoutPlanCollaboratorEntity } from './workout-plan-collaborator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { WorkoutPlanCollaboratorInvitationEntity } from './invitation/workout-plan-collaborator-invitation.entity';

@Injectable()
export class WorkoutPlanCollaboratorService {
  constructor(
    @InjectRepository(WorkoutPlanCollaboratorEntity)
    private workoutPlanCollaboratorRepository: Repository<WorkoutPlanCollaboratorEntity>,

    @InjectRepository(WorkoutPlanCollaboratorInvitationEntity)
    private workoutPlanCollaboratorInvitationEntityRepository: Repository<WorkoutPlanCollaboratorInvitationEntity>,
  ) {}

  async findAll(workoutPlanId: number, options: IPaginationOptions) {
    const res = await paginate<WorkoutPlanCollaboratorEntity>(
      this.workoutPlanCollaboratorRepository,
      options,
      {
        where: [{ workoutPlanId }],
        relations: ['user', 'role', 'permission'],
      },
    );
    return new Pagination(
      res.items.map((elem) => {
        return elem.createWorkoutPlanCollaboratorDto();
      }),
      res.meta,
      res.links,
    );
  }

  async inviteCollaborator(
    inviteeUserId: number,
    workoutPlanId: number,
    roleId: number,
    permissionId: number,
    inviterUserId: number,
  ) {
    const invitation = this.workoutPlanCollaboratorInvitationEntityRepository.create();
    invitation.workoutPlanId = workoutPlanId;
    invitation.inviteeUserId = inviteeUserId;
    invitation.roleId = roleId;
    invitation.permissionId = permissionId;
    invitation.inviterUserId = inviterUserId;
    const invitationInDb = await this.workoutPlanCollaboratorInvitationEntityRepository.findOne(
      {
        workoutPlanId,
        inviterUserId,
        inviteeUserId,
      },
    );
    // NOTE: this is currently not the best solution since it requires two queries
    // we have to wait until typeorm supports 'upserts'
    if (invitationInDb) {
      invitation.id = invitationInDb.id;
    }
    const newInvitation = await this.workoutPlanCollaboratorInvitationEntityRepository.save(
      invitation,
    );
    // If inserted, return new invitation
    // If updated, return nothing
    if (!invitationInDb) return newInvitation;
  }

  async isCollaborator(workoutPlanId: number, userId: bigint) {
    const res = await this.workoutPlanCollaboratorRepository.find({
      where: [
        {
          workoutPlanId,
          userId,
        },
      ],
    });
    return res.length !== 0;
  }
}
