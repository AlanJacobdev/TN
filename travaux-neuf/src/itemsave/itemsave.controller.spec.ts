import { Test, TestingModule } from '@nestjs/testing';
import { ItemsaveController } from './itemsave.controller';
import { ItemsaveService } from './itemsave.service';

describe('ItemsaveController', () => {
  let controller: ItemsaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsaveController],
      providers: [ItemsaveService],
    }).compile();

    controller = module.get<ItemsaveController>(ItemsaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
