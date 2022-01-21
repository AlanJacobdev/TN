import { Test, TestingModule } from '@nestjs/testing';
import { SousitemService } from './sousitem.service';

describe('SousitemService', () => {
  let service: SousitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SousitemService],
    }).compile();

    service = module.get<SousitemService>(SousitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
