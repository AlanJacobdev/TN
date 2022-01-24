import { Test, TestingModule } from '@nestjs/testing';
import { DroitparserviceController } from './droitparservice.controller';
import { DroitparserviceService } from './droitparservice.service';

describe('DroitparserviceController', () => {
  let controller: DroitparserviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DroitparserviceController],
      providers: [DroitparserviceService],
    }).compile();

    controller = module.get<DroitparserviceController>(DroitparserviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
