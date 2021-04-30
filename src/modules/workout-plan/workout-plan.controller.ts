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
import { WorkoutPlanAccessGuard } from '../../guards/workout-plan-access.guard';
import { UserService } from '../user/user.service';
import { InviteCollaboratorRequestDto } from '../workout-plan-collaborator/dto/invite-collaborator-request.dto';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';

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
      workoutPlanDto.owner.username !== ownerName ||
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
   * @param params
   * @param authUser
   * @param paginated
   */
  @Get(Routes.workoutPlan.get.collaborators)
  @UseGuards(JwtAuthGuard)
  async findCollaborators(
    @Param() params,
    @AuthUser() authUser,
    @Paginated() paginated,
  ) {
    const { ownerName, workoutPlanName } = params;
    const owner = await this.userService.findOnePublicUserByUsername(ownerName);
    const workoutPlan = await this.workoutPlanService.findOneByNameAndUserId(
      workoutPlanName,
      owner.id,
    );
    const isCollaborator = await this.workoutPlanCollaboratorService.isCollaborator(
      workoutPlan.id,
      authUser.userId,
    );
    // If the authenticated user is the owner of the workout plan, grant access
    if (workoutPlan.owner.username === authUser.username) {
      return await this.workoutPlanCollaboratorService.findAllCollaboratorsByWorkoutPlanId(
        workoutPlan.id,
        paginated,
      );
    }
    // If the authenticated user is not a collaborator, deny access
    if (isCollaborator) {
      return await this.workoutPlanCollaboratorService.findAllCollaboratorsByWorkoutPlanId(
        workoutPlan.id,
        paginated,
      );
    } else {
      throw new NotFoundException();
    }
  }

  /**
   * Invites a user to be a collaborator to the
   *
   * @param params
   * @param authUser
   * @param inviteCollaboratorDto
   * @param res
   */
  @Put(Routes.workoutPlan.put.inviteCollaborator)
  @UseGuards(JwtAuthGuard, WorkoutPlanAccessGuard) //ToDo: workout exists guard
  async inviteCollaborator(
    @Param() params,
    @AuthUser() authUser,
    @Body() inviteCollaboratorDto: InviteCollaboratorRequestDto,
    @Res() res: Response,
  ) {
    const { workoutPlanName, username } = params;
    const inviterUserId = authUser.userId;
    const invitee = await this.userService.findOnePublicUserByUsername(
      username,
    );
    const workoutPlan = await this.workoutPlanService.findOneByName(
      workoutPlanName,
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
   * @param params
   * @param updateWorkoutPlanDto
   */
  @Patch(Routes.workoutPlan.patch.one)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateWorkoutPlanForUser(
    @AuthUser() authUser,
    @Param() params,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    const { ownerName, workoutPlanName } = params;
    const { username, userId } = authUser;
    if (ownerName !== username) {
      throw new UnauthorizedException();
    }
    await this.workoutPlanService.update(
      updateWorkoutPlanDto,
      workoutPlanName,
      userId,
    );
  }

  /**
   * Deletes the workout plan according to the given params
   * An authenticated user and a valid workout plan name is required
   *
   * If the user does not have permission, a not authorized error will be thrown
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
