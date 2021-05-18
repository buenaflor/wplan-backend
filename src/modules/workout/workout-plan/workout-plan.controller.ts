import {
  Controller,
  Get,
  UseGuards,
  Param,
  Body,
  NotFoundException,
  Put,
  Res,
  HttpStatus,
  Post,
  UnprocessableEntityException,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { WorkoutPlanService } from './service/workout-plan.service';
import { OptionalJwtGuard } from '../../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from '../../auth-user/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { Routes } from '../../../config/constants';
import { Paginated } from '../../../utils/decorators/paginated.decorator';
import { WorkoutPlanCollaboratorService } from '../workout-plan-collaborator/workout-plan-collaborator.service';
import { UserService } from '../../user/user.service';
import { InviteCollaboratorRequestDto } from '../workout-plan-collaborator/dto/request/invite-collaborator-request.dto';
import { WorkoutPlanRoleService } from '../workout-plan-role/workout-plan-role.service';
import { WorkoutPlanPermissionService } from '../workout-plan-permission/workout-plan-permission.service';
import { SearchWorkoutPlanDto } from './dto/request/search-workout-plan.dto';
import { SearchWorkoutPlanQuery } from './decorator/search-workout-plan.decorator';
import { WorkoutPlanId } from './decorator/workout-plan-id.decorator';
import { WorkoutDayService } from '../workout-day/service/workout-day.service';
import {
  CreateWorkoutDayBulkDto,
  CreateWorkoutDayDto,
} from '../workout-day/dto/request/create-workout-day.dto';
import { MyLogger } from '../../../logging/my.logger';
import { AuthUserDto } from '../../auth-user/dto/auth-user.dto';
import { UpdateWorkoutDayBulkDto } from '../workout-day/dto/request/update-workout-day.dto';

@Controller(Routes.workoutPlan.controller)
export class WorkoutPlanController {
  constructor(
    private readonly workoutPlanService: WorkoutPlanService,
    private readonly workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
    private readonly workoutDayService: WorkoutDayService,
    private readonly userService: UserService,
    private readonly roleService: WorkoutPlanRoleService,
    private readonly permissionService: WorkoutPlanPermissionService,
  ) {}

  private readonly logger = new MyLogger(WorkoutPlanController.name);

  //================================================================================
  // Workout Plan
  //================================================================================

  /**
   * Returns all public workout plans
   *
   * @param searchWorkoutPlanQuery
   * @param paginated
   */
  @Get()
  async findAllPublic(
    @SearchWorkoutPlanQuery() searchWorkoutPlanQuery: SearchWorkoutPlanDto,
    @Paginated() paginated,
  ) {
    this.logger.log(
      `findAllPublic(${searchWorkoutPlanQuery.ownerName}, ${searchWorkoutPlanQuery.workoutPlanName})`,
    );
    return await this.workoutPlanService.findAllPublic(
      paginated,
      searchWorkoutPlanQuery,
    );
  }

  /**
   * Finds one workout plan matching a workout plan id
   * If the workout plan is private, the unauthenticated recipient
   * will always receive a 404 Not Found error
   *
   * Otherwise, the authenticated owner of the workout plan, will be able
   * to fetch the resource
   *
   * @param workoutPlanId
   * @param authUser
   */
  @Get(Routes.workoutPlan.get.one)
  @UseGuards(OptionalJwtGuard)
  async findOne(
    @WorkoutPlanId() workoutPlanId: string,
    @AuthUser() authUser: AuthUserDto,
  ) {
    this.logger.log(`findOne(${workoutPlanId}, ${authUser.username})`);
    return await this.workoutPlanService.findOneById(workoutPlanId, authUser);
  }

  //================================================================================
  // Collaborator
  //================================================================================

  /**
   * Returns a list of open invitations of the workout plan
   *
   * @param workoutPlanId
   * @param authUser
   * @param paginated
   */
  @Get(Routes.workoutPlan.get.openInvitations)
  @UseGuards(JwtAuthGuard)
  async getOpenInvitations(
    @WorkoutPlanId() workoutPlanId: string,
    @AuthUser() authUser: AuthUserDto,
    @Paginated() paginated,
  ) {
    this.logger.log(
      `getOpenInvitations(${workoutPlanId}, ${authUser.username})`,
    );
    return await this.workoutPlanCollaboratorService.getAllInvitationsByWorkoutPlanId(
      workoutPlanId,
      authUser,
      paginated,
    );
  }

  /**
   * Returns the collaborators of a workout plan
   * Requires an authenticated user and if the auth user is not
   * a collaborator with at least read workout-plan-permission then deny access to the resource
   *
   * @param workoutPlanId
   * @param authUser
   * @param paginated
   */
  @Get(Routes.workoutPlan.get.collaborators)
  @UseGuards(JwtAuthGuard)
  async getCollaborators(
    @WorkoutPlanId() workoutPlanId: string,
    @AuthUser() authUser,
    @Paginated() paginated,
  ) {
    this.logger.log(`getCollaborators(${workoutPlanId}, ${authUser.username})`);
    return await this.workoutPlanCollaboratorService.findAllCollaboratorsByWorkoutPlanId(
      workoutPlanId,
      authUser,
      paginated,
    );
  }

  /**
   * Invites a user to be a collaborator to the workout plan
   * A user can only have one invitation per workout plan
   * Sending multiple invitations by multiple users will only replace
   * the current invitation in the database
   *
   * @param authUser
   * @param workoutPlanId
   * @param inviteCollaboratorDto
   * @param params
   * @param res
   */
  @Put(Routes.workoutPlan.put.inviteCollaborator)
  @UseGuards(JwtAuthGuard)
  async inviteCollaborator(
    @WorkoutPlanId() workoutPlanId: string,
    @AuthUser() authUser,
    @Body() inviteCollaboratorDto: InviteCollaboratorRequestDto,
    @Param() params,
    @Res() res: Response,
  ) {
    const { inviteeUsername } = params;
    // ToDo: decorator
    this.logger.log(
      `inviteCollaborator(${workoutPlanId}, ${authUser.username}) invites ${inviteeUsername}`,
    );
    const inviterUserId = authUser.userId;
    const invitee = await this.userService.findOnePublicUserByUsername(
      inviteeUsername,
    );
    if (invitee.id === inviterUserId) {
      throw new UnprocessableEntityException(
        'Cannot send invitation to oneself',
      );
    }
    const role = await this.roleService.findOneByName(
      inviteCollaboratorDto.role,
    );
    const permission = await this.permissionService.findOneByName(
      inviteCollaboratorDto.permission,
    );
    const invitation = await this.workoutPlanCollaboratorService.inviteCollaborator(
      invitee.id,
      workoutPlanId,
      role.id,
      permission.id,
      inviterUserId,
    );
    if (invitation) {
      res.status(HttpStatus.OK).send(invitation);
    } else {
      res.status(HttpStatus.NO_CONTENT).send();
    }
  }

  //================================================================================
  // Workout Day
  //================================================================================

  /**
   * Creates a workout day for a workout plan
   * Requester needs to be a collaborator with write access
   *
   * @param workoutPlanId
   * @param authUser
   * @param createWorkoutDayBulkDto
   */
  @Post(Routes.workoutPlan.post.workoutDays)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async createWorkoutDays(
    @WorkoutPlanId() workoutPlanId: string,
    @AuthUser() authUser: AuthUserDto,
    @Body() createWorkoutDayBulkDto: CreateWorkoutDayBulkDto,
  ) {
    this.logger.log(
      `createWorkoutDays(${workoutPlanId}, ${authUser.username})`,
    );
    createWorkoutDayBulkDto.workoutDays.forEach(
      (elem) => (elem.workoutPlanId = workoutPlanId),
    );
    await this.workoutDayService.saveMultiple(
      workoutPlanId,
      createWorkoutDayBulkDto.workoutDays,
      authUser,
    );
  }

  /**
   * Updates the workout day according to workout the passed in body
   *
   * @param updateMultipleWorkoutDayDto
   * @param authUser
   */
  @Put(Routes.workoutPlan.put.workoutDays)
  @UseGuards(JwtAuthGuard)
  async updateWorkoutDays(
    @Body()
    updateMultipleWorkoutDayDto: UpdateWorkoutDayBulkDto,
    @AuthUser() authUser: AuthUserDto,
  ) {
    this.logger.log(`updateWorkoutDays(${authUser.username})`);
    return await this.workoutDayService.updateMultiple(
      updateMultipleWorkoutDayDto.workoutDays,
      authUser,
    );
  }

  /**
   * Fetches all workout days of a workout plan
   * Requester needs to be a collaborator with at least read access
   *
   * @param workoutPlanId
   * @param paginated
   * @param authUser
   */
  @Get(Routes.workoutPlan.get.workoutDays)
  @UseGuards(JwtAuthGuard)
  async getWorkoutDays(
    @WorkoutPlanId() workoutPlanId: string,
    @AuthUser() authUser: AuthUserDto,
    @Paginated() paginated,
  ) {
    this.logger.log(`getWorkoutDays(${workoutPlanId}, ${authUser.username})`);
    return this.workoutDayService.findAll(workoutPlanId, paginated, authUser);
  }
}
