import { Test, TestingModule } from '@nestjs/testing';
import { NbDemandeGateway } from './nb-demande.gateway';

describe('NbDemandeGateway', () => {
  let gateway: NbDemandeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NbDemandeGateway],
    }).compile();

    gateway = module.get<NbDemandeGateway>(NbDemandeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
