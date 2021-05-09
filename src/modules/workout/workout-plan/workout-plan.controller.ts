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
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { WorkoutPlanService } from './workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from '../../auth-user/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { Routes } from '../../../config/constants';
import { Paginated } from '../../../utils/decorators/paginated.decorator';
import { WorkoutPlanCollaboratorService } from '../workout-plan-collaborator/workout-plan-collaborator.service';
import { UserService } from '../../user/user.service';
import { InviteCollaboratorRequestDto } from '../workout-plan-collaborator/dto/invite-collaborator-request.dto';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../../permission/permission.service';
import { WorkoutPlanCollaboratorGuard } from '../../../guards/workout-plan-collaborator.guard';
import { WorkoutPlanCollaboratorWriteAccessGuard } from '../../../guards/workout-plan-collaborator-write-access.guard';
import { WorkoutPlanCollaboratorAdminAccessGuard } from '../../../guards/workout-plan-collaborator-admin-access.guard';
import { WorkoutPlanCollaboratorReadAccessGuard } from '../../../guards/workout-plan-collaborator-read-access.guard';
import { SearchWorkoutPlanDto } from './dto/request/search-workout-plan.dto';
import { SearchWorkoutPlanQuery } from './decorator/search-workout-plan.decorator';
import { WorkoutPlanId } from './decorator/workout-plan-id.decorator';
import { WorkoutDayService } from '../workout-day/workout-day.service';
import { CreateWorkoutDayDto } from '../workout-day/dto/request/create-workout-day.dto';
import { MyLogger } from '../../../log/my.logger';

@Controller(Routes.workoutPlan.controller)
export class WorkoutPlanController {
  constructor(
    private readonly workoutPlanService: WorkoutPlanService,
    private readonly workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
    private readonly workoutDayService: WorkoutDayService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
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
    this.logger.log('findAllPublic()');
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
  @UseGuards(AllowAnonymousJwtGuard)
  async getOne(@WorkoutPlanId() workoutPlanId: string, @AuthUser() authUser) {
    const workoutPlanDto = await this.workoutPlanService.findOneById(
      workoutPlanId,
    );
    if (authUser && authUser.userId === workoutPlanDto.owner.id) {
      return workoutPlanDto;
    }
    if (authUser) {
      const isCollaborator = await this.workoutPlanCollaboratorService.isCollaborator(
        workoutPlanId,
        authUser.userId,
      );
      if (isCollaborator) return workoutPlanDto;
    }
    if (workoutPlanDto.isPrivate) {
      throw new NotFoundException();
    }
  }

  //================================================================================
  // Collaborator
  //================================================================================

  /**
   * Returns a list of open invitations of the workout plan
   *
   * @param workoutPlanId
   * @param paginated
   */
  @Get(Routes.workoutPlan.get.openInvitations)
  @UseGuards(
    WorkoutPlanCollaboratorGuard,
    WorkoutPlanCollaboratorAdminAccessGuard,
  )
  async getOpenInvitations(
    @WorkoutPlanId() workoutPlanId: string,
    @Paginated() paginated,
  ) {
    return await this.workoutPlanCollaboratorService.getAllInvitationsByWorkoutPlanId(
      workoutPlanId,
      paginated,
    );
  }

  /**
   * Returns the collaborators of a workout plan
   * Requires an authenticated user and if the auth user is not
   * a collaborator with at least read permission then deny access to the resource
   *
   * @param workoutPlanId
   * @param authUser
   * @param paginated
   */
  @Get(Routes.workoutPlan.get.collaborators)
  @UseGuards(
    JwtAuthGuard,
    WorkoutPlanCollaboratorGuard,
    WorkoutPlanCollaboratorReadAccessGuard,
  )
  async getCollaborators(
    @WorkoutPlanId() workoutPlanId: string,
    @AuthUser() authUser,
    @Paginated() paginated,
  ) {
    return await this.workoutPlanCollaboratorService.findAllCollaboratorsByWorkoutPlanId(
      workoutPlanId,
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
  @UseGuards(
    JwtAuthGuard,
    WorkoutPlanCollaboratorGuard,
    WorkoutPlanCollaboratorAdminAccessGuard,
  )
  async inviteCollaborator(
    @AuthUser() authUser,
    @WorkoutPlanId() workoutPlanId: string,
    @Body() inviteCollaboratorDto: InviteCollaboratorRequestDto,
    @Param() params,
    @Res() res: Response,
  ) {
    const { inviteeUsername } = params;
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
   * @param createWorkoutDayDto
   * @param workoutPlanId
   */
  @Post(Routes.workoutPlan.post.workoutDays)
  @UseGuards(
    JwtAuthGuard,
    WorkoutPlanCollaboratorGuard,
    WorkoutPlanCollaboratorWriteAccessGuard,
  )
  async createWorkoutDay(
    @Body() createWorkoutDayDto: CreateWorkoutDayDto,
    @WorkoutPlanId() workoutPlanId: string,
  ) {
    createWorkoutDayDto.workoutPlanId = workoutPlanId;
    return this.workoutDayService.save(createWorkoutDayDto);
  }

  /**
   * Fetches all workout days of a workout plan
   * Requester needs to be a collaborator with at least read access
   *
   * @param workoutPlanId
   * @param paginated
   */
  @Get(Routes.workoutPlan.get.workoutDays)
  @UseGuards(
    JwtAuthGuard,
    WorkoutPlanCollaboratorGuard,
    WorkoutPlanCollaboratorReadAccessGuard,
  )
  async getWorkoutDays(
    @WorkoutPlanId() workoutPlanId: string,
    @Paginated() paginated,
  ) {
    return this.workoutDayService.findAll(workoutPlanId, paginated);
  }
}
