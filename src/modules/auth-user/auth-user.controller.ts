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
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { AuthUser } from './decorator/auth-user.decorator';
import { PrivateUserDto } from '../user/dto/private-user.dto';
import { WorkoutPlanService } from '../workout-plan/workout-plan.service';
import { CreateWorkoutPlanDto } from '../workout-plan/dto/create-workout-plan.dto';
import { Paginated } from '../../utils/decorators/paginated.decorator';
import { Routes } from '../../config/constants';
import { WorkoutPlanCollaboratorService } from '../workout-plan-collaborator/workout-plan-collaborator.service';

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
  async getAuthenticatedUser(@AuthUser() authUser): Promise<PrivateUserDto> {
    return await this.userService.findOnePrivateUserById(authUser.userId);
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
    @AuthUser() authUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(updateUserDto, authUser.userId);
    // TODO: if changing email, verified changes to false, maybe with trigger?
  }

  /**
   * Finds all workout plans that the authenticated user has permission to access
   *
   * The authenticated user has explicit permission to access workout plans they own or
   * where they are a collaborator
   *
   * -> Currently only workout plans where the user is the owner will be returned
   * TODO: implement collaboration / coaching
   *
   * @param authUser
   * @param paginated
   */
  @Get(Routes.authUser.get.workoutPlans)
  @UseGuards(JwtAuthGuard)
  async getWorkoutPlans(@AuthUser() authUser, @Paginated() paginated) {
    return await this.workoutPlanService.findAllAccessibleByUser(
      authUser.userId,
      paginated,
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
    @AuthUser() authUser,
    @Body() createWorkoutPlanDTO: CreateWorkoutPlanDto,
  ) {
    // TODO: dont allow duplicate workout plan names for a user
    await this.workoutPlanService.save(createWorkoutPlanDTO, authUser.userId);
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
    @AuthUser() authUser,
  ) {
    return await this.workoutPlanCollaboratorService.findAllInvitationsByUserId(
      authUser.userId,
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
  async acceptWorkoutPlanInvitation(@Param() params, @AuthUser() authUser) {
    const { invitationId } = params;
    return await this.workoutPlanCollaboratorService.acceptInvitation(
      invitationId,
      authUser.userId,
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
  async declineWorkoutPlanInvitation(@Param() params, @AuthUser() authUser) {
    const { invitationId } = params;
    return this.workoutPlanCollaboratorService.declineInvitation(
      invitationId,
      authUser.userId,
    );
  }
}
