import { Test, TestingModule } from '@nestjs/testing';
import { SpecialOrdersService } from './special-orders.service';

describe('SpecialOrdersService', () => {
  let service: SpecialOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialOrdersService],
    }).compile();

    service = module.get<SpecialOrdersService>(SpecialOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
