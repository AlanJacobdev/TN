import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRecopieService } from './service-recopie.service';

describe('ServiceRecopieService', () => {
  let service: ServiceRecopieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceRecopieService],
    }).compile();

    service = module.get<ServiceRecopieService>(ServiceRecopieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
