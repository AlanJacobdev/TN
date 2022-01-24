import { Test, TestingModule } from '@nestjs/testing';
import { DroitparserviceService } from './droitparservice.service';

describe('DroitparserviceService', () => {
  let service: DroitparserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DroitparserviceService],
    }).compile();

    service = module.get<DroitparserviceService>(DroitparserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
