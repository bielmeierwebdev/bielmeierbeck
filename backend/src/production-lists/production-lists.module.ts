import { Module } from '@nestjs/common';

import { ProductionListsController } from './production-lists.controller';

import { ProductionListsService } from './production-lists.service';

import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ProductionListsController],

  providers: [ProductionListsService, PrismaService],
})
export class ProductionListsModule {}
