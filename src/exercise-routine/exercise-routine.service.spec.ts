import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseRoutineService } from './exercise-routine.service';

describe('ExerciseRoutineService', () => {
  let service: ExerciseRoutineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseRoutineService],
    }).compile();

    service = module.get<ExerciseRoutineService>(ExerciseRoutineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
