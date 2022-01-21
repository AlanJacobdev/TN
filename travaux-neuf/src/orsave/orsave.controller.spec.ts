import { Test, TestingModule } from '@nestjs/testing';
import { OrsaveController } from './orsave.controller';
import { OrsaveService } from './orsave.service';

describe('OrsaveController', () => {
  let controller: OrsaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrsaveController],
      providers: [OrsaveService],
    }).compile();

    controller = module.get<OrsaveController>(OrsaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
