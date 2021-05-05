import {
  Controller,
  Get,
  UseGuards,
  Param,
  Patch,
  Body,
  UnauthorizedException,
  Delete,
  HttpCode,
  NotFoundException,
  Put,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { WorkoutPlanService } from './workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from '../auth-user/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { Routes } from '../../config/constants';
import { Paginated } from '../../utils/decorators/paginated.decorator';
import { WorkoutPlanCollaboratorService } from '../workout-plan-collaborator/workout-plan-collaborator.service';
import { UserService } from '../user/user.service';
import { InviteCollaboratorRequestDto } from '../workout-plan-collaborator/dto/invite-collaborator-request.dto';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { WorkoutPlanCollaboratorGuard } from '../../guards/workout-plan-collaborator.guard';
import { PublicUserDto } from '../user/dto/public-user-dto';
import { PublicWorkoutPlanDto } from './dto/public-workout-plan.dto';
import { WorkoutPlan } from './decorator/workout-plan.decorator';
import { Owner } from '../user/decorator/owner.decorator';
import { WorkoutPlanCollaboratorWriteAccessGuard } from '../../guards/workout-plan-collaborator-write-access.guard';
import { WorkoutPlanCollaboratorAdminAccessGuard } from '../../guards/workout-plan-collaborator-admin-access.guard';
import { WorkoutPlanCollaboratorReadAccessGuard } from '../../guards/workout-plan-collaborator-read-access.guard';

@Controller(Routes.workoutPlan.controller)
export class WorkoutPlanController {
  constructor(
    private readonly workoutPlanService: WorkoutPlanService,
    private readonly workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  /**
   * Returns all public workout plans
   *
   * @param paginated
   */
  @Get()
  async findAllPublic(@Paginated() paginated) {
    return await this.workoutPlanService.findAllPublic(paginated);
  }

  /**
   * Finds one workout plan matching a user and workout plan name
   * If the workout plan is private, the unauthenticated recipient
   * will always receive a 404 Not Found error
   *
   * Otherwise, the authenticated owner of the workout plan, will be able
   * to fetch the resource
   *
   * @param params
   * @param authUser
   */
  @Get(Routes.workoutPlan.get.one)
  @UseGuards(AllowAnonymousJwtGuard)
  async findOneForUser(@Param() params, @AuthUser() authUser) {
    const { ownerName, workoutPlanName } = params;
    const workoutPlanDto = await this.workoutPlanService.findOneByName(
      workoutPlanName,
    );
    if (authUser && authUser.userId === workoutPlanDto.owner.id) {
      return workoutPlanDto;
    }
    if (authUser) {
      const isCollaborator = await this.workoutPlanCollaboratorService.isCollaborator(
        workoutPlanDto.id,
        authUser.userId,
      );
      if (isCollaborator) return workoutPlanDto;
    }
    if (
      workoutPlanDto.owner.login !== ownerName ||
      workoutPlanDto.isPrivate
    ) {
      throw new NotFoundException();
    }
    return workoutPlanDto;
  }

  /**
   * Returns the collaborators of a workout plan
   * Requires an authenticated user and if the auth user is not
   * a collaborator then deny access to the resource
   *
   * @param owner
   * @param workoutPlan
   * @param authUser
   * @param paginated
   */
  @Get(Routes.workoutPlan.get.collaborators)
  @UseGuards(
    JwtAuthGuard,
    WorkoutPlanCollaboratorGuard,
    WorkoutPlanCollaboratorReadAccessGuard,
  )
  async findCollaborators(
    @Owner() owner: PublicUserDto,
    @WorkoutPlan() workoutPlan: PublicWorkoutPlanDto,
    @AuthUser() authUser,
    @Paginated() paginated,
  ) {
    return await this.workoutPlanCollaboratorService.findAllCollaboratorsByWorkoutPlanId(
      workoutPlan.id,
      paginated,
    );
  }

  /**
   * Invites a user to be a collaborator to the workout plan
   * A user can only have one invitation per workout plan
   * Sending multiple invitations by multiple users will only replace
   * the current invitation in the database
   *
   * @param owner
   * @param workoutPlan
   * @param authUser
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
    @Owner() owner: PublicUserDto,
    @WorkoutPlan() workoutPlan: PublicWorkoutPlanDto,
    @AuthUser() authUser,
    @Body() inviteCollaboratorDto: InviteCollaboratorRequestDto,
    @Param() params,
    @Res() res: Response,
  ) {
    const { username } = params;
    const inviterUserId = authUser.userId;
    const invitee = await this.userService.findOnePublicUserByUsername(
      username,
    );
    const role = await this.roleService.findOneByName(
      inviteCollaboratorDto.role,
    );
    const permission = await this.permissionService.findOneByName(
      inviteCollaboratorDto.permission,
    );
    const invitation = await this.workoutPlanCollaboratorService.inviteCollaborator(
      invitee.id,
      workoutPlan.id,
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

  /**
   * Updates the workout plan according to updateWorkoutPlanDto and
   * the given params. An authenticated user and a valid workout plan name
   * is required.
   *
   * @param authUser
   * @param owner
   * @param workoutPlan
   * @param updateWorkoutPlanDto
   */
  @Patch(Routes.workoutPlan.patch.one)
  @UseGuards(
    JwtAuthGuard,
    WorkoutPlanCollaboratorGuard,
    WorkoutPlanCollaboratorWriteAccessGuard,
  )
  async updateWorkoutPlanForUser(
    @AuthUser() authUser,
    @Owner() owner: PublicUserDto,
    @WorkoutPlan() workoutPlan: PublicWorkoutPlanDto,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    return await this.workoutPlanService.update(
      updateWorkoutPlanDto,
      workoutPlan.id,
      owner.id,
    );
  }

  /**
   * Deletes the workout plan according to the given params
   * An authenticated user and a valid workout plan name is required
   *
   * The authenticated user has to be the owner of the workout plan
   *
   * @param authUser
   * @param params
   */
  @Delete(Routes.workoutPlan.delete.one)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteWorkoutPlanForUser(@AuthUser() authUser, @Param() params) {
    const { ownerName, workoutPlanName } = params;
    const { username } = authUser;
    if (ownerName !== username) {
      throw new UnauthorizedException();
    }
    await this.workoutPlanService.delete({ name: workoutPlanName });
  }
}
