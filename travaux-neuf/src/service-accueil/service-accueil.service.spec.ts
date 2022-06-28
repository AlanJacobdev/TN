import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAccueilService } from './service-accueil.service';

describe('ServiceAccueilService', () => {
  let service: ServiceAccueilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceAccueilService],
    }).compile();

    service = module.get<ServiceAccueilService>(ServiceAccueilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
