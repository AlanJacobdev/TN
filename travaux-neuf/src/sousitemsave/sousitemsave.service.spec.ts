import { Test, TestingModule } from '@nestjs/testing';
import { SousitemsaveService } from './sousitemsave.service';

describe('SousitemsaveService', () => {
  let service: SousitemsaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SousitemsaveService],
    }).compile();

    service = module.get<SousitemsaveService>(SousitemsaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
