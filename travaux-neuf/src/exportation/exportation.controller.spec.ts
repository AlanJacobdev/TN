import { Test, TestingModule } from '@nestjs/testing';
import { ExportationController } from './exportation.controller';
import { ExportationService } from './exportation.service';

describe('ExportationController', () => {
  let controller: ExportationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportationController],
      providers: [ExportationService],
    }).compile();

    controller = module.get<ExportationController>(ExportationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
