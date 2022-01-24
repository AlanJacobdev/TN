import { Test, TestingModule } from '@nestjs/testing';
import { DroitparutilisateurService } from './droitparutilisateur.service';

describe('DroitparutilisateurService', () => {
  let service: DroitparutilisateurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DroitparutilisateurService],
    }).compile();

    service = module.get<DroitparutilisateurService>(DroitparutilisateurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
