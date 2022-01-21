import { Test, TestingModule } from '@nestjs/testing';
import { TypeobjetrepereService } from './typeobjetrepere.service';

describe('TypeobjetrepereService', () => {
  let service: TypeobjetrepereService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeobjetrepereService],
    }).compile();

    service = module.get<TypeobjetrepereService>(TypeobjetrepereService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
