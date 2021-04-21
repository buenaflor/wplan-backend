import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseWlSetService } from './exercise-wl-set.service';

describe('ExerciseWlSetService', () => {
  let service: ExerciseWlSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseWlSetService],
    }).compile();

    service = module.get<ExerciseWlSetService>(ExerciseWlSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
