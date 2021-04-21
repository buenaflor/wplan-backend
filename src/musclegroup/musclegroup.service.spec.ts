import { Test, TestingModule } from '@nestjs/testing';
import { MusclegroupService } from './musclegroup.service';

describe('MusclegroupService', () => {
  let service: MusclegroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusclegroupService],
    }).compile();

    service = module.get<MusclegroupService>(MusclegroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
