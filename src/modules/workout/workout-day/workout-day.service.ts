import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutDay } from './workout-day.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CreateWorkoutDayDto } from './dto/request/create-workout-day.dto';
import { UpdateWorkoutDayDto } from './dto/request/update-workout-day.dto';
import {
  WorkoutDayAction,
  WorkoutDayPolicyFactory,
} from './policies/workout-day-policy.factory';
import { CheckPolicies } from '../../../common/policy/check-policies.decorator';
import { UpdateWorkoutDayPolicyHandler } from './policies/update-workout-day-policy.handler';
import { AuthUserDto } from '../../auth-user/dto/auth-user.dto';
import { WorkoutPlanCollaboratorService } from '../workout-plan-collaborator/workout-plan-collaborator.service';
import { CaslAbilityFactory } from '../../../common/casl/casl-ability.factory';

@Injectable()
export class WorkoutDayService {
  constructor(
    @InjectRepository(WorkoutDay)
    private workoutDayRepository: Repository<WorkoutDay>,
    private workoutDayPolicyFactory: WorkoutDayPolicyFactory,
    private workoutAbilityFactory: CaslAbilityFactory,
    private workoutPlanCollaboratorService: WorkoutPlanCollaboratorService,
  ) {}

  /**
   * Retrieves all workout days associated with the workout plan id
   *
   * @param workoutPlanId
   * @param options
   */
  async findAll(workoutPlanId: string, options: IPaginationOptions) {
    const res = await paginate<WorkoutDay>(this.workoutDayRepository, options, {
      where: [{ workoutPlanId }],
      relations: [
        'workoutPlan',
        'workoutPlan.owner',
        //'exerciseRoutines',
        //'exerciseRoutines.exercise',
        //'exerciseRoutines.sets',
      ],
    });
    return new Pagination(
      res.items.map((elem) => {
        return elem.toDto();
      }),
      res.meta,
      res.links,
    );
  }

  /**
   * Finds a workout day with the id
   *
   * @param workoutDayId
   */
  async findOneById(workoutDayId: string) {
    const res = await this.workoutDayRepository.findOne({
      where: [{ id: workoutDayId }],
      relations: ['workoutPlan', 'workoutPlan.owner'],
    });
    if (!res) throw new NotFoundException();
    return res.toDto();
  }

  /**
   * Updates the workout day entity and returns it
   *
   * @param updateWorkoutDayDto
   */
  async update(updateWorkoutDayDto: UpdateWorkoutDayDto) {
    const workoutDay = await this.workoutDayRepository.preload(
      updateWorkoutDayDto,
    );
    if (!workoutDay) {
      throw new NotFoundException('Could not find workout day');
    }
    const res = await this.workoutDayRepository.save(workoutDay);
    return res.toDto();
  }

  @CheckPolicies(new UpdateWorkoutDayPolicyHandler())
  async updateMultiple(
    updateWorkoutDayDtos: [UpdateWorkoutDayDto],
    user: AuthUserDto,
  ) {
    const userId = user.userId;
    const workoutPlanId = updateWorkoutDayDtos[0].workoutPlanId;
    if (!(await this.authorizeUpdateMultiple(workoutPlanId, userId))) {
      throw new UnauthorizedException();
    }
    const workoutDays = updateWorkoutDayDtos.map((elem) =>
      this.workoutDayRepository.create(elem),
    );
    console.log(workoutDays);
  }

  private async authorizeUpdateMultiple(
    workoutPlanId: string,
    userId: string,
  ): Promise<boolean> {
    this.workoutDayPolicyFactory.setHandler(
      WorkoutDayAction.UpdateMultiple,
      new UpdateWorkoutDayPolicyHandler(),
    );
    const collaborator = await this.workoutPlanCollaboratorService.findOneRaw(
      workoutPlanId,
      userId,
    );
    if (!collaborator) {
      throw new UnauthorizedException();
    }
    const ability = this.workoutAbilityFactory.createForWorkoutPlanCollaborator(
      collaborator,
    );
    return this.workoutDayPolicyFactory.authorize(
      WorkoutDayAction.UpdateMultiple,
      ability,
    );
    // get collaborator and return boolean
  }

  async delete(workoutPlanId: string) {
    const res = await this.workoutDayRepository.delete(workoutPlanId);
    if (res.affected === 0) {
      throw new InternalServerErrorException('No entity was deleted');
    }
    if (res.affected > 1) {
      throw new InternalServerErrorException('More than one deleted');
    }
  }

  /**
   * Saves a create workout day dto to the database
   *
   * @param createWorkoutDayDto
   */
  async save(createWorkoutDayDto: CreateWorkoutDayDto) {
    const entity = new WorkoutDay(createWorkoutDayDto);
    const res = await this.workoutDayRepository.save(entity);
    return this.findOneById(res.id);
  }
}
