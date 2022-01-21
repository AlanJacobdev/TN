import { Test, TestingModule } from '@nestjs/testing';
import { SousitemController } from './sousitem.controller';
import { SousitemService } from './sousitem.service';

describe('SousitemController', () => {
  let controller: SousitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SousitemController],
      providers: [SousitemService],
    }).compile();

    controller = module.get<SousitemController>(SousitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
