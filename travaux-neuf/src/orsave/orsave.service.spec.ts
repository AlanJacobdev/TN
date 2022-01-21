import { Test, TestingModule } from '@nestjs/testing';
import { OrsaveService } from './orsave.service';

describe('OrsaveService', () => {
  let service: OrsaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrsaveService],
    }).compile();

    service = module.get<OrsaveService>(OrsaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
