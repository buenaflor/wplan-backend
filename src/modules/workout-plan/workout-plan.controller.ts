import {
  Controller,
  Get,
  UseGuards,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlanMapper } from './mapper/workout-plan.mapper';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { UserService } from '../user/user.service';
import { AuthUser } from '../user/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';

@Controller('workoutplans')
export class WorkoutPlanController {
  constructor(
    private readonly workoutPlanService: WorkoutPlanService,
    private readonly userService: UserService,
    private readonly workoutPlanMapper: WorkoutPlanMapper,
  ) {}

  /**
   * Finds one workout plan matching the parameters
   * If the workout plan is private, the unauthenticated recipient
   * will always receive a 404 Not Found error
   *
   * Otherwise, the authenticated owner of the workout plan, will be able
   * to fetch the resource
   *
   * @param params
   * @param authUser
   */
  @Get('/:ownerName/:workoutPlanName')
  @UseGuards(AllowAnonymousJwtGuard)
  async findOneForUser(@Param() params, @AuthUser() authUser) {
    const { ownerName, workoutPlanName } = params;
    try {
      const user = await this.userService.findOneByUsername(ownerName);
      const workoutPlan = await this.workoutPlanService.findOneByNameAndOwnerId(
        workoutPlanName,
        user.id,
      );
      this.workoutPlanService.verifyAccess(workoutPlan, authUser);
      return this.workoutPlanMapper.workoutPlanEntityToDto(workoutPlan);
    } catch (e) {
      throw e;
    }
  }

  @Patch('/:ownerName/:workoutPlanName')
  @UseGuards(JwtAuthGuard)
  async updateWorkoutPlanForUser(
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    console.log(updateWorkoutPlanDto.name);
  }
}
