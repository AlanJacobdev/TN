import { Test, TestingModule } from '@nestjs/testing';
import { NumerouniqueService } from './numerounique.service';

describe('NumerouniqueService', () => {
  let service: NumerouniqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NumerouniqueService],
    }).compile();

    service = module.get<NumerouniqueService>(NumerouniqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
