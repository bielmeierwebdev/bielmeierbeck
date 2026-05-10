import { Module } from '@nestjs/common';

import { SpecialOrdersController } from './special-orders.controller';

import { SpecialOrdersService } from './special-orders.service';

import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [SpecialOrdersController],

  providers: [SpecialOrdersService],
})
export class SpecialOrdersModule {}
