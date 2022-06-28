import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAccueilController } from './service-accueil.controller';
import { ServiceAccueilService } from './service-accueil.service';

describe('ServiceAccueilController', () => {
  let controller: ServiceAccueilController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceAccueilController],
      providers: [ServiceAccueilService],
    }).compile();

    controller = module.get<ServiceAccueilController>(ServiceAccueilController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
