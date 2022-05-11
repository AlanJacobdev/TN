import { Test, TestingModule } from '@nestjs/testing';
import { ServiceSuppressionController } from './service-suppression.controller';
import { ServiceSuppressionService } from './service-suppression.service';

describe('ServiceSuppressionController', () => {
  let controller: ServiceSuppressionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceSuppressionController],
      providers: [ServiceSuppressionService],
    }).compile();

    controller = module.get<ServiceSuppressionController>(ServiceSuppressionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
