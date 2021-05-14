import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanPermissionService } from './workout-plan-permission.service';

describe('PermissionService', () => {
  let service: WorkoutPlanPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutPlanPermissionService],
    }).compile();

    service = module.get<WorkoutPlanPermissionService>(WorkoutPlanPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
