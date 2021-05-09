import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../../../config/constants';
import { WorkoutDayId } from './decorator/workout-day-id.decorator';
import { UpdateWorkoutDayDto } from './dto/request/update-workout-day.dto';
import { WorkoutDayService } from './workout-day.service';
import { CaslAbilityFactory } from '../../../common/casl/casl-ability.factory';
import { WorkoutPlanCollaboratorService } from '../workout-plan-collaborator/workout-plan-collaborator.service';
import { AuthUser } from '../../auth-user/decorator/auth-user.decorator';
import { Action } from '../../../common/casl/actions';
import { AllowAnonymousJwtGuard } from '../../../guards/allow-anonymous-jwt-guard.service';

@Controller(Routes.workoutDay.controller)
export class WorkoutDayController {
  constructor(
    private readonly workoutDayService: WorkoutDayService,
    private readonly workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  /**
   * Returns one workout day by id
   *
   * @param workoutDayId
   * @param authUser
   */
  @Get(Routes.workoutDay.get.one)
  @UseGuards(AllowAnonymousJwtGuard)
  async findOne(@WorkoutDayId() workoutDayId: string, @AuthUser() authUser) {
    const workoutDay = await this.workoutDayService.findOneById(workoutDayId);
    /*const workoutPlanId = workoutDay.workoutPlan.id;

    const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
      workoutPlanId,
      authUser.userId,
    );

    const ability = this.caslAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
    ability.can(Action.read, 'all');

     */

    return workoutDay;
  }

  /**
   * Updates the workout day according to workout the passed in body
   *
   * @param workoutDayId
   * @param updateWorkoutDayDto
   */
  @Patch(Routes.workoutDay.patch.one)
  async updateWorkoutDay(
    @WorkoutDayId() workoutDayId: string,
    @Body() updateWorkoutDayDto: UpdateWorkoutDayDto,
  ) {
    updateWorkoutDayDto.id = workoutDayId;
    return this.workoutDayService.update(updateWorkoutDayDto);
  }

  /**
   * Finds the workout day with id and deletes it
   *
   * @param workoutDayId
   */
  @Delete(Routes.workoutDay.delete.one)
  @HttpCode(204)
  async deleteWorkoutDay(@WorkoutDayId() workoutDayId: string) {
    return this.workoutDayService.delete(workoutDayId);
  }
}
