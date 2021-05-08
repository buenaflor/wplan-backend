import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutDayController } from './workout-day.controller';

describe('WorkoutdayController', () => {
  let controller: WorkoutDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutDayController],
    }).compile();

    controller = module.get<WorkoutDayController>(WorkoutDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
