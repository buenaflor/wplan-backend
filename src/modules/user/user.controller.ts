import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileDto } from '../user-profile/dto/user-profile.dto';
import { WorkoutPlanService } from '../workout-plan/workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from './decorator/auth-user.decorator';
import { WorkoutPlanMapper } from '../workout-plan/mapper/workout-plan.mapper';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateWorkoutPlanDto } from '../workout-plan/dto/create-workout-plan.dto';

/**
 * This controller provides publicly available information about someone
 * with an account
 *
 */
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private workoutPlanService: WorkoutPlanService,
    private workoutPlanMapper: WorkoutPlanMapper,
  ) {}

  /**
   *
   * @param params
   */
  @Get('/:username')
  @UseGuards(AllowAnonymousJwtGuard)
  async findUserByUsername(@Param() params) {
    const { username } = params;
    try {
      const user = await this.userService.findOneByUsername(username);
      return UserProfileDto.createFromUser(user);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Finds all workout plans associated with an owner. If no authenticated owner
   * can be found, it returns all public workout plans of the owner. Otherwise,
   * also private and public workout plan will be returned.
   *
   * @param params
   * @param authUser
   * @param page
   * @param perPage
   */
  @Get('/:username/workoutplans')
  @UseGuards(AllowAnonymousJwtGuard)
  async findWorkoutPlansForUser(
    @Param() params,
    @AuthUser() authUser,
    @Query('page') page = 1,
    @Query('per_page') perPage = 30,
  ) {
    perPage = perPage > 100 ? 100 : perPage;
    const { username } = params;
    try {
      const user = await this.userService.findOneByUsername(username);
      const workoutPlans = await this.workoutPlanService.findAllByOwner(
        user,
        authUser,
        {
          page,
          limit: perPage,
        },
      );
      workoutPlans.items = workoutPlans.items.map((elem) => {
        return this.workoutPlanMapper.workoutPlanEntityToDto(elem);
      });
      return workoutPlans;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Creates a workout plan and assigns it to the specified user
   * Workout plans can only be created and assigned by an authenticated user
   *
   * @param createWorkoutPlanDto
   * @param req
   */
  @Post('/:ownerName/')
  @UseGuards(JwtAuthGuard)
  async createWorkoutPlanForUser(
    @Body() createWorkoutPlanDto: CreateWorkoutPlanDto,
    @Request() req,
  ) {
    if (req.user.userId !== createWorkoutPlanDto.userId) {
      throw new UnauthorizedException();
    }
    try {
    } catch (e) {
      throw e;
    }
    console.log(createWorkoutPlanDto);
  }
}
