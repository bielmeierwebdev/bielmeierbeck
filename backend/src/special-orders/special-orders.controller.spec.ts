import { Test, TestingModule } from '@nestjs/testing';
import { SpecialOrdersController } from './special-orders.controller';

describe('SpecialOrdersController', () => {
  let controller: SpecialOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialOrdersController],
    }).compile();

    controller = module.get<SpecialOrdersController>(SpecialOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
