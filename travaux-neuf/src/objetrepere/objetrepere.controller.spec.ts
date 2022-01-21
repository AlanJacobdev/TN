import { Test, TestingModule } from '@nestjs/testing';
import { ObjetrepereController } from './objetrepere.controller';
import { ObjetrepereService } from './objetrepere.service';

describe('ObjetrepereController', () => {
  let controller: ObjetrepereController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjetrepereController],
      providers: [ObjetrepereService],
    }).compile();

    controller = module.get<ObjetrepereController>(ObjetrepereController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
