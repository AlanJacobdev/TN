import { Test, TestingModule } from '@nestjs/testing';
import { DemandeAdminTraiteeService } from './demande-admin-traitee.service';

describe('DemandeAdminTraiteeService', () => {
  let service: DemandeAdminTraiteeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandeAdminTraiteeService],
    }).compile();

    service = module.get<DemandeAdminTraiteeService>(DemandeAdminTraiteeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
