import { Test, TestingModule } from '@nestjs/testing';
import { TypeobjetrepereController } from './typeobjetrepere.controller';
import { TypeobjetrepereService } from './typeobjetrepere.service';

describe('TypeobjetrepereController', () => {
  let controller: TypeobjetrepereController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeobjetrepereController],
      providers: [TypeobjetrepereService],
    }).compile();

    controller = module.get<TypeobjetrepereController>(TypeobjetrepereController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
