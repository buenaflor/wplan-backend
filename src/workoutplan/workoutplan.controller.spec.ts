import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutplanController } from './workoutplan.controller';

describe('WorkoutplanController', () => {
  let controller: WorkoutplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutplanController],
    }).compile();

    controller = module.get<WorkoutplanController>(WorkoutplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
