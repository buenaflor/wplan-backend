import {
  ForbiddenException,
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
import { AuthUserDto } from '../../auth-user/dto/auth-user.dto';
import { WorkoutAbilityFactory } from '../../../common/casl/workout-ability-factory.service';
import { WriteWorkoutPlanPolicyHandler } from '../workout-plan/policy/write-workout-plan-policy.handler';
import { AdminWorkoutPlanPolicyHandler } from '../workout-plan/policy/admin-workout-plan-policy.handler';

@Injectable()
export class WorkoutPlanCollaboratorService {
  constructor(
    @InjectRepository(WorkoutPlanCollaboratorEntity)
    private workoutPlanCollaboratorRepository: Repository<WorkoutPlanCollaboratorEntity>,
    @InjectRepository(WorkoutPlanCollaboratorInvitationEntity)
    private workoutPlanCollaboratorInvitationEntityRepository: Repository<WorkoutPlanCollaboratorInvitationEntity>,
    private workoutAbilityFactory: WorkoutAbilityFactory,
  ) {}

  /**
   * Returns all workout plan ids where the given user id is a collaborator
   *
   * @param authUser
   */
  async findAllWorkoutPlanIdsForCollaborator(authUser: AuthUserDto) {
    const res = await this.workoutPlanCollaboratorRepository.find({
      userId: authUser.userId,
    });
    return res.map((elem) => elem.workoutPlanId);
  }

  /**
   * Finds and returns all collaborators of a specific workout plan
   *
   * @param workoutPlanId
   * @param authUser
   * @param options
   */
  async findAllCollaboratorsByWorkoutPlanId(
    workoutPlanId: string,
    authUser: AuthUserDto,
    options: IPaginationOptions,
  ) {
    // Authorization
    const collaborator = await this.findOneRaw(workoutPlanId, authUser.userId);
    if (!collaborator) throw new ForbiddenException('Must be a collaborator');
    const ability = this.workoutAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
    const handler = new WriteWorkoutPlanPolicyHandler();
    if (!handler.handle(ability))
      throw new ForbiddenException(
        'Must have write access to the workout plan',
      );

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

  /**
   * Returns a list of all invitations that a workout plan has
   *
   * @param workoutPlanId
   * @param authUser
   * @param options
   */
  async getAllInvitationsByWorkoutPlanId(
    workoutPlanId: string,
    authUser: AuthUserDto,
    options: IPaginationOptions,
  ) {
    // Authorization
    const collaborator = await this.findOneRaw(workoutPlanId, authUser.userId);
    if (!collaborator) throw new ForbiddenException('Must be a collaborator');
    const ability = this.workoutAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
    const handler = new AdminWorkoutPlanPolicyHandler();
    if (!handler.handle(ability))
      throw new ForbiddenException(
        'Must have admin rights to the workout plan',
      );

    const res = await paginate<WorkoutPlanCollaboratorInvitationEntity>(
      this.workoutPlanCollaboratorInvitationEntityRepository,
      options,
      {
        where: [{ workoutPlanId }],
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
        return elem.createWorkoutPlanInvitationDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Returns a list of all invitations that the authenticated user has
   *
   * @param authUser
   * @param options
   */
  async getAllInvitationsByUser(
    authUser: AuthUserDto,
    options: IPaginationOptions,
  ) {
    const res = await paginate<WorkoutPlanCollaboratorInvitationEntity>(
      this.workoutPlanCollaboratorInvitationEntityRepository,
      options,
      {
        where: [{ inviteeUserId: authUser.userId }],
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
        return elem.createWorkoutPlanInvitationDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Accepts a collaboration invitation
   *
   * @param invitationId
   * @param authUser
   */
  async acceptInvitation(invitationId: string, authUser: AuthUserDto) {
    const invitation = await this.workoutPlanCollaboratorInvitationEntityRepository.findOne(
      {
        id: invitationId,
        inviteeUserId: authUser.userId,
      },
    );
    if (!invitation) {
      throw new NotFoundException('Cannot find invitation');
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
        inviteeUserId: authUser.userId,
      },
    );
    if (deleteResult.affected === 0) {
      throw new NotFoundException();
    }
    if (deleteResult.affected > 1) {
      throw new InternalServerErrorException();
    }
  }

  async declineInvitation(invitationId: string, authUser: AuthUserDto) {
    const deleteResult = await this.workoutPlanCollaboratorInvitationEntityRepository.delete(
      {
        id: invitationId,
        inviteeUserId: authUser.userId,
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
   * @param inviterUser
   */
  async inviteCollaborator(
    inviteeUserId: string,
    workoutPlanId: string,
    roleId: string,
    permissionId: string,
    inviterUser: AuthUserDto,
  ) {
    // Authorization
    const collaborator = await this.findOneRaw(
      workoutPlanId,
      inviterUser.userId,
    );
    if (!collaborator) throw new ForbiddenException('Must be a collaborator');
    const ability = this.workoutAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
    const handler = new AdminWorkoutPlanPolicyHandler();
    if (!handler.handle(ability))
      throw new ForbiddenException(
        'Must have admin rights to the workout plan',
      );

    const invitation = this.workoutPlanCollaboratorInvitationEntityRepository.create();
    invitation.workoutPlanId = workoutPlanId;
    invitation.inviteeUserId = inviteeUserId;
    invitation.roleId = roleId;
    invitation.permissionId = permissionId;
    invitation.inviterUserId = inviterUser.userId;
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
          where: [
            { workoutPlanId, inviterUserId: inviterUser.userId, inviteeUserId },
          ],
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
      return finalInvitation.createWorkoutPlanInvitationDto();
    }
  }
}
