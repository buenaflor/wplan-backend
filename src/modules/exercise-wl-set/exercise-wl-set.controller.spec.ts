import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseWlSetController } from './exercise-wl-set.controller';

describe('ExerciseWlSetController', () => {
  let controller: ExerciseWlSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseWlSetController],
    }).compile();

    controller = module.get<ExerciseWlSetController>(ExerciseWlSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
