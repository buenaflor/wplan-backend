import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  HttpCode,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateUserDto } from '../user/dto/request/update-user.dto';
import { AuthUser } from './decorator/auth-user.decorator';
import { PrivateUserDto } from '../user/dto/response/private-user.dto';
import { WorkoutPlanService } from '../workout/workout-plan/service/workout-plan.service';
import { CreateWorkoutPlanDto } from '../workout/workout-plan/dto/request/create-workout-plan.dto';
import { Paginated } from '../../utils/decorators/paginated.decorator';
import { Routes } from '../../config/constants';
import { WorkoutPlanCollaboratorService } from '../workout/workout-plan-collaborator/workout-plan-collaborator.service';
import { WorkoutPlanId } from '../workout/workout-plan/decorator/workout-plan-id.decorator';
import { UpdateWorkoutPlanDto } from '../workout/workout-plan/dto/request/update-workout-plan.dto';
import { AuthUserDto } from './dto/auth-user.dto';

/**
 * This controller is responsible for handling authenticated user requests
 * Requests to this controller are only possible with an access token
 *
 */
@Controller(Routes.authUser.controller)
export class AuthUserController {
  constructor(
    private userService: UserService,
    private workoutPlanService: WorkoutPlanService,
    private workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  /**
   * Returns publicly and privately available information of the authenticated user
   *
   * @param authUser
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAuthenticatedUser(
    @AuthUser() authUser: AuthUserDto,
  ): Promise<PrivateUserDto> {
    return await this.userService.findOnePrivateUser(authUser);
  }

  /**
   * Updates the user based on UpdateUserDto
   *
   * @param authUser
   * @param updateUserDto
   */
  @Patch()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateAuthenticatedUser(
    @AuthUser() authUser: AuthUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(updateUserDto, authUser);
    // TODO: if changing email, verified changes to false, maybe with trigger?
  }

  /**
   * Finds all workout plans that the authenticated user has workout-plan-permission to access
   *
   * The authenticated user has explicit workout-plan-permission to access workout plans they own or
   * where they are a collaborator
   *
   * @param authUser
   * @param paginated
   */
  @Get(Routes.authUser.get.workoutPlans)
  @UseGuards(JwtAuthGuard)
  async getWorkoutPlans(
    @AuthUser() authUser: AuthUserDto,
    @Paginated() paginated,
  ) {
    return await this.workoutPlanService.findAllAccessibleByUser(
      authUser,
      paginated,
    );
  }

  /**
   * Returns a list of open invitations for the authenticated user
   *
   * @param paginated
   * @param authUser
   */
  @Get(Routes.authUser.get.workoutPlanInvitations)
  @UseGuards(JwtAuthGuard)
  async getWorkoutPlanInvitations(
    @Paginated() paginated,
    @AuthUser() authUser: AuthUserDto,
  ) {
    return await this.workoutPlanCollaboratorService.getAllInvitationsByUser(
      authUser,
      paginated,
    );
  }

  /**
   * Accepts a workout plan invitation
   * Searches for an invitation with the invitation id and the authenticated user id
   * saves the data as collaborator to the workout plan and deletes the invitation.
   *
   * If no match is found, a not found exception is thrown
   *
   * @param params
   * @param authUser
   */
  @Patch(Routes.authUser.patch.acceptWorkoutPlanInvitation)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async acceptWorkoutPlanInvitation(
    @Param() params,
    @AuthUser() authUser: AuthUserDto,
  ) {
    const { invitationId } = params;
    return await this.workoutPlanCollaboratorService.acceptInvitation(
      invitationId,
      authUser,
    );
  }

  /**
   * Declines a workout plan invitation
   * Searches for an invitation with the invitation id and the authenticated user id
   * and deletes it. If no match is found, a not found exception is thrown
   *
   * @param params
   * @param authUser
   */
  @Delete(Routes.authUser.delete.declineWorkoutPlanInvitation)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async declineWorkoutPlanInvitation(
    @Param() params,
    @AuthUser() authUser: AuthUserDto,
  ) {
    const { invitationId } = params;
    return this.workoutPlanCollaboratorService.declineInvitation(
      invitationId,
      authUser,
    );
  }

  /**
   * Creates a workout plan where the authenticated user is the owner
   *
   * @param authUser
   * @param createWorkoutPlanDTO
   */
  @Post(Routes.authUser.post.workoutPlans)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async createWorkoutPlan(
    @AuthUser() authUser: AuthUserDto,
    @Body() createWorkoutPlanDTO: CreateWorkoutPlanDto,
  ) {
    await this.workoutPlanService.save(createWorkoutPlanDTO, authUser);
  }

  /**
   * Updates the workout plan according to updateWorkoutPlanDto and
   * the given params. An authenticated user and a valid workout plan name
   * is required.
   *
   * @param authUser
   * @param workoutPlanId
   * @param updateWorkoutPlanDto
   */
  @Patch(Routes.authUser.patch.workoutPlan)
  @UseGuards(JwtAuthGuard)
  async updateWorkoutPlan(
    @AuthUser() authUser: AuthUserDto,
    @WorkoutPlanId() workoutPlanId: string,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    return await this.workoutPlanService.update(
      updateWorkoutPlanDto,
      workoutPlanId,
      authUser,
    );
  }

  /**
   * Deletes the workout plan according to the given params
   * An authenticated user and a valid workout plan name is required
   *
   * The authenticated user has to be the owner of the workout plan
   *
   * @param workoutPlanId
   * @param authUser
   */
  @Delete(Routes.authUser.delete.workoutPlan)
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteWorkoutPlanForUser(
    @WorkoutPlanId() workoutPlanId: string,
    @AuthUser() authUser: AuthUserDto,
  ) {
    await this.workoutPlanService.delete({ id: workoutPlanId }, authUser);
  }
}
