import { Test, TestingModule } from '@nestjs/testing';
import { SousitemsaveController } from './sousitemsave.controller';
import { SousitemsaveService } from './sousitemsave.service';

describe('SousitemsaveController', () => {
  let controller: SousitemsaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SousitemsaveController],
      providers: [SousitemsaveService],
    }).compile();

    controller = module.get<SousitemsaveController>(SousitemsaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
