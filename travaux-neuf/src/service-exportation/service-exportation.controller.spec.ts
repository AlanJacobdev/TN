import { Test, TestingModule } from '@nestjs/testing';
import { ServiceExportationController } from './service-exportation.controller';
import { ServiceExportationService } from './service-exportation.service';

describe('ServiceExportationController', () => {
  let controller: ServiceExportationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceExportationController],
      providers: [ServiceExportationService],
    }).compile();

    controller = module.get<ServiceExportationController>(ServiceExportationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
