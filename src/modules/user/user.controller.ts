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
import { WorkoutPlanService } from '../workout-plan/workout-plan.service';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { AuthUser } from './decorator/auth-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateWorkoutPlanDto } from '../workout-plan/dto/create-workout-plan.dto';

/**
 * This controller provides endpoints for handling
 * publicly available information about someone
 * with an account
 *
 */
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private workoutPlanService: WorkoutPlanService,
  ) {}

  /**
   * Returns the publicly available information of a user
   *
   * @param params
   */
  @Get('/:username')
  @UseGuards(AllowAnonymousJwtGuard)
  async findUserByUsername(@Param() params) {
    const { username } = params;
    return await this.userService.findPublicUserByUsername(username);
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
      const user = await this.userService.findPublicUserByUsername(username);
      return await this.workoutPlanService.findAllPublicByOwner(user.id, {
        page,
        limit: perPage,
      });
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
