import { Test, TestingModule } from '@nestjs/testing';
import { ServiceExportationService } from './service-exportation.service';

describe('ServiceExportationService', () => {
  let service: ServiceExportationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceExportationService],
    }).compile();

    service = module.get<ServiceExportationService>(ServiceExportationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
