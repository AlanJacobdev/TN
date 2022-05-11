import { Test, TestingModule } from '@nestjs/testing';
import { ServiceSuppressionService } from './service-suppression.service';

describe('ServiceSuppressionService', () => {
  let service: ServiceSuppressionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceSuppressionService],
    }).compile();

    service = module.get<ServiceSuppressionService>(ServiceSuppressionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
