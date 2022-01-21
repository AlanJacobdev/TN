import { Test, TestingModule } from '@nestjs/testing';
import { TypeobjetService } from './typeobjet.service';

describe('TypeobjetService', () => {
  let service: TypeobjetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeobjetService],
    }).compile();

    service = module.get<TypeobjetService>(TypeobjetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
