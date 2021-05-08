import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseRoutineController } from './exercise-routine.controller';

describe('ExerciseRoutineController', () => {
  let controller: ExerciseRoutineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseRoutineController],
    }).compile();

    controller = module.get<ExerciseRoutineController>(
      ExerciseRoutineController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
