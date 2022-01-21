import { Test, TestingModule } from '@nestjs/testing';
import { AtelierController } from './atelier.controller';
import { AtelierService } from './atelier.service';

describe('AtelierController', () => {
  let controller: AtelierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtelierController],
      providers: [AtelierService],
    }).compile();

    controller = module.get<AtelierController>(AtelierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
