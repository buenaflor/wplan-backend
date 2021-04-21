import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutdayController } from './workout-day.controller';

describe('WorkoutdayController', () => {
  let controller: WorkoutdayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutdayController],
    }).compile();

    controller = module.get<WorkoutdayController>(WorkoutdayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
