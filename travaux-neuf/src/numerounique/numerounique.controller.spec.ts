import { Test, TestingModule } from '@nestjs/testing';
import { NumerouniqueController } from './numerounique.controller';
import { NumerouniqueService } from './numerounique.service';

describe('NumerouniqueController', () => {
  let controller: NumerouniqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NumerouniqueController],
      providers: [NumerouniqueService],
    }).compile();

    controller = module.get<NumerouniqueController>(NumerouniqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
