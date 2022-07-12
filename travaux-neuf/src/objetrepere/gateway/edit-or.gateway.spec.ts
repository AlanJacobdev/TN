import { Test, TestingModule } from '@nestjs/testing';
import { EditOrGateway } from './edit-or.gateway';

describe('EditOrGateway', () => {
  let gateway: EditOrGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditOrGateway],
    }).compile();

    gateway = module.get<EditOrGateway>(EditOrGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
