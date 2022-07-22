import { Test, TestingModule } from '@nestjs/testing';
import { DemandeAdminTraiteeController } from './demande-admin-traitee.controller';
import { DemandeAdminTraiteeService } from './demande-admin-traitee.service';

describe('DemandeAdminTraiteeController', () => {
  let controller: DemandeAdminTraiteeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandeAdminTraiteeController],
      providers: [DemandeAdminTraiteeService],
    }).compile();

    controller = module.get<DemandeAdminTraiteeController>(DemandeAdminTraiteeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
