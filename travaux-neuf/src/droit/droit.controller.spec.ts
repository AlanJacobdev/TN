import { Test, TestingModule } from '@nestjs/testing';
import { DroitController } from './droit.controller';
import { DroitService } from './droit.service';

describe('DroitController', () => {
  let controller: DroitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DroitController],
      providers: [DroitService],
    }).compile();

    controller = module.get<DroitController>(DroitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
