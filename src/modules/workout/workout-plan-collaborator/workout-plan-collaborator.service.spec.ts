import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanCollaboratorService } from './workout-plan-collaborator.service';

describe('WorkoutPlanCollaboratorService', () => {
  let service: WorkoutPlanCollaboratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutPlanCollaboratorService],
    }).compile();

    service = module.get<WorkoutPlanCollaboratorService>(
      WorkoutPlanCollaboratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
