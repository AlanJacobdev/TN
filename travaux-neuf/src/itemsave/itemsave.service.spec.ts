import { Test, TestingModule } from '@nestjs/testing';
import { ItemsaveService } from './itemsave.service';

describe('ItemsaveService', () => {
  let service: ItemsaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsaveService],
    }).compile();

    service = module.get<ItemsaveService>(ItemsaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
