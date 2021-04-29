import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkoutPlanCollaboratorEntity } from './workout-plan-collaborator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class WorkoutPlanCollaboratorService {
  constructor(
    @InjectRepository(WorkoutPlanCollaboratorEntity)
    private workoutPlanCollaboratorRepository: Repository<WorkoutPlanCollaboratorEntity>,
  ) {}

  async findAll(workoutPlanId: number, options: IPaginationOptions) {
    const res = await paginate<WorkoutPlanCollaboratorEntity>(
      this.workoutPlanCollaboratorRepository,
      options,
      {
        where: [{ workoutPlanId }],
        relations: ['user', 'role', 'permission'],
      },
    );
    return new Pagination(
      res.items.map((elem) => {
        return elem.createWorkoutPlanCollaboratorDto();
      }),
      res.meta,
      res.links,
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
