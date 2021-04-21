import { Test, TestingModule } from '@nestjs/testing';
import { MusclegroupController } from './musclegroup.controller';

describe('MusclegroupController', () => {
  let controller: MusclegroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusclegroupController],
    }).compile();

    controller = module.get<MusclegroupController>(MusclegroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
