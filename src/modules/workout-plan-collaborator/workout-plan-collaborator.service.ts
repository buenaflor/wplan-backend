import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  /**
   * Returns all workout plan ids where the given user id is a collaborator
   *
   * @param collaboratorId
   */
  async findAllWorkoutPlanIdsForCollaborator(collaboratorId: string) {
    const res = await this.workoutPlanCollaboratorRepository.find({
      userId: collaboratorId,
    });
    return res.map((elem) => elem.workoutPlanId);
  }

  /**
   * Finds and returns all collaborators of a specific workout plan
   *
   * @param workoutPlanId
   * @param options
   */
  async findAllCollaboratorsByWorkoutPlanId(
    workoutPlanId: string,
    options: IPaginationOptions,
  ) {
    const res = await paginate<WorkoutPlanCollaboratorEntity>(
      this.workoutPlanCollaboratorRepository,
      options,
      {
        where: [{ workoutPlanId: workoutPlanId }],
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

  async findOneRaw(workoutPlanId: string, userId: string) {
    return this.workoutPlanCollaboratorRepository.findOne({
      where: [{ userId, workoutPlanId }],
      relations: ['permission'],
    });
  }

  async findAllInvitationsByUserId(
    userId: number,
    options: IPaginationOptions,
  ) {
    const res = await paginate<WorkoutPlanCollaboratorInvitationEntity>(
      this.workoutPlanCollaboratorInvitationEntityRepository,
      options,
      {
        where: [{ inviteeUserId: userId }],
        relations: [
          'workoutPlan',
          'workoutPlan.owner',
          'inviter',
          'invitee',
          'role',
          'permission',
        ],
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

  /**
   * Accepts a collaboration invitation
   *
   * @param invitationId
   * @param userId
   */
  async acceptInvitation(invitationId: string, userId: string) {
    const invitation = await this.workoutPlanCollaboratorInvitationEntityRepository.findOne(
      {
        id: invitationId,
        inviteeUserId: userId,
      },
    );
    if (!invitation) {
      throw new NotFoundException();
    }
    const collaborator = this.workoutPlanCollaboratorRepository.create();
    collaborator.userId = invitation.inviteeUserId;
    collaborator.workoutPlanId = invitation.workoutPlanId;
    collaborator.roleId = invitation.roleId;
    collaborator.permissionId = invitation.permissionId;
    await this.workoutPlanCollaboratorRepository.save(collaborator);
    const deleteResult = await this.workoutPlanCollaboratorInvitationEntityRepository.delete(
      {
        id: invitationId,
        inviteeUserId: userId,
      },
    );
    if (deleteResult.affected === 0) {
      throw new NotFoundException();
    }
    if (deleteResult.affected > 1) {
      throw new InternalServerErrorException();
    }
  }

  async declineInvitation(invitationId: string, userId: string) {
    const deleteResult = await this.workoutPlanCollaboratorInvitationEntityRepository.delete(
      {
        id: invitationId,
        inviteeUserId: userId,
      },
    );
    if (deleteResult.affected === 0) {
      throw new NotFoundException();
    }
    if (deleteResult.affected > 1) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Creates an invitation from an inviter to an invitee for a workout plan
   *
   * issues: multiple redundant queries that are not natively supported by typeorm
   * https://github.com/typeorm/typeorm/issues/3490
   *
   * @param inviteeUserId
   * @param workoutPlanId
   * @param roleId
   * @param permissionId
   * @param inviterUserId
   */
  async inviteCollaborator(
    inviteeUserId: string,
    workoutPlanId: string,
    roleId: string,
    permissionId: string,
    inviterUserId: string,
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
        inviteeUserId,
      },
    );
    // NOTE: this is currently not the best solution since it requires two queries
    // we have to wait until typeorm supports 'upserts'
    if (invitationInDb) {
      invitation.id = invitationInDb.id;
    }
    await this.workoutPlanCollaboratorInvitationEntityRepository.save(
      invitation,
    );
    // If inserted, return new invitation
    // If updated, return nothing
    if (!invitationInDb) {
      const finalInvitation = await this.workoutPlanCollaboratorInvitationEntityRepository.findOne(
        {
          where: [{ workoutPlanId, inviterUserId, inviteeUserId }],
          relations: [
            'workoutPlan',
            'workoutPlan.owner',
            'inviter',
            'invitee',
            'role',
            'permission',
          ],
        },
      );
      return finalInvitation.createWorkoutPlanCollaboratorDto();
    }
  }

  async isCollaborator(workoutPlanId: number, userId: string) {
    const res = await this.workoutPlanCollaboratorRepository.findOne({
      where: [
        {
          workoutPlanId,
          userId,
        },
      ],
    });
    return !!res;
  }
}
