import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutplanService } from './workoutplan.service';

describe('WorkoutplanService', () => {
  let service: WorkoutplanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutplanService],
    }).compile();

    service = module.get<WorkoutplanService>(WorkoutplanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
