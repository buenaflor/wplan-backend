import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkoutPlanCollaboratorEntity } from './workout-plan-collaborator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class WorkoutPlanCollaboratorService {
  constructor(
    @InjectRepository(WorkoutPlanCollaboratorEntity)
    private workoutPlanCollaboratorRepository: Repository<WorkoutPlanCollaboratorEntity>,
  ) {}

  async findAll(workoutPlanId: number, options: IPaginationOptions) {
    return await paginate<WorkoutPlanCollaboratorEntity>(
      this.workoutPlanCollaboratorRepository,
      options,
      {
        where: [{ workoutPlanId }],
      },
    );
  }

  async isCollaborator(workoutPlanId: number, userId: bigint) {
    const res = await this.workoutPlanCollaboratorRepository.find({
      where: [
        {
          workoutPlanId,
          userId,
        },
      ],
    });
    return res.length !== 0;
  }
}
