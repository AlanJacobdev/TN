import { Test, TestingModule } from '@nestjs/testing';
import { TypeobjetController } from './typeobjet.controller';
import { TypeobjetService } from './typeobjet.service';

describe('TypeobjetController', () => {
  let controller: TypeobjetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeobjetController],
      providers: [TypeobjetService],
    }).compile();

    controller = module.get<TypeobjetController>(TypeobjetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
