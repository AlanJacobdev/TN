import { Test, TestingModule } from '@nestjs/testing';
import { ParametreService } from './parametre.service';

describe('ParametreService', () => {
  let service: ParametreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParametreService],
    }).compile();

    service = module.get<ParametreService>(ParametreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
