import { Test, TestingModule } from '@nestjs/testing';
import { DroitService } from './droit.service';

describe('DroitService', () => {
  let service: DroitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DroitService],
    }).compile();

    service = module.get<DroitService>(DroitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
