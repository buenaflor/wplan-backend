import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanRoleService } from './workout-plan-role.service';

describe('RoleService', () => {
  let service: WorkoutPlanRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutPlanRoleService],
    }).compile();

    service = module.get<WorkoutPlanRoleService>(WorkoutPlanRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
