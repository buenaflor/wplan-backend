import { Test, TestingModule } from '@nestjs/testing';
import { MuscleGroupService } from './muscle-group.service';

describe('MusclegroupService', () => {
  let service: MuscleGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuscleGroupService],
    }).compile();

    service = module.get<MuscleGroupService>(MuscleGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
