import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRecopieController } from './service-recopie.controller';
import { ServiceRecopieService } from './service-recopie.service';

describe('ServiceRecopieController', () => {
  let controller: ServiceRecopieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceRecopieController],
      providers: [ServiceRecopieService],
    }).compile();

    controller = module.get<ServiceRecopieController>(ServiceRecopieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
