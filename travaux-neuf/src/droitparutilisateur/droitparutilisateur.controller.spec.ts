import { Test, TestingModule } from '@nestjs/testing';
import { DroitparutilisateurController } from './droitparutilisateur.controller';
import { DroitparutilisateurService } from './droitparutilisateur.service';

describe('DroitparutilisateurController', () => {
  let controller: DroitparutilisateurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DroitparutilisateurController],
      providers: [DroitparutilisateurService],
    }).compile();

    controller = module.get<DroitparutilisateurController>(DroitparutilisateurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
