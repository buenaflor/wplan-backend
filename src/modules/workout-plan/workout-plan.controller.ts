import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { WorkoutPlanService } from './workout-plan.service';
import { WorkoutPlanMapper } from './mapper/workout-plan.mapper';
import { AllowAnonymousJwtGuard } from '../../guards/allow-anonymous-jwt-guard.service';
import { UserService } from '../user/user.service';
import { AuthUser } from '../user/decorator/auth-user.decorator';

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
  async findOne(@Param() params, @AuthUser() authUser) {
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

  /*

  @UseGuards(JwtAuthGuard)
  @Get('/users/')
  async index(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Request() req,
  ) {
    limit = limit > 20 ? 20 : limit;
    return this.workoutPlanService.paginate({
      page,
      limit,
      route: 'http://localhost:4000/api/v1/workoutplans',
    });
  }

   */
}
