import { Test, TestingModule } from '@nestjs/testing';
import { ObjetrepereService } from './objetrepere.service';

describe('ObjetrepereService', () => {
  let service: ObjetrepereService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjetrepereService],
    }).compile();

    service = module.get<ObjetrepereService>(ObjetrepereService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
