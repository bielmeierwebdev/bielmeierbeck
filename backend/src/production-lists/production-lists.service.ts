import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

import { CreateProductionListDto } from './dto/create-production-list.dto';

type ProductionItem = {
  name: string;

  ordered: number;

  production: number;
};

@Injectable()
export class ProductionListsService {
  constructor(private prisma: PrismaService) {}

  async getSaturdayList() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.productionList.findFirst({
      where: {
        date: {
          gte: today,

          lt: tomorrow,
        },
      },

      include: {
        items: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: CreateProductionListDto) {
    return this.prisma.productionList.create({
      data: {
        date: new Date(),

        items: {
          create: data.items.map((item: ProductionItem) => ({
            productName: item.name,

            orderedQuantity: item.ordered,

            productionAmount: item.production,
          })),
        },
      },

      include: {
        items: true,
      },
    });
  }

  async update(
    id: number,

    data: CreateProductionListDto,
  ) {
    return this.prisma.productionList.update({
      where: {
        id,
      },

      data: {
        items: {
          deleteMany: {},

          create: data.items.map((item: ProductionItem) => ({
            productName: item.name,

            orderedQuantity: item.ordered,

            productionAmount: item.production,
          })),
        },
      },

      include: {
        items: true,
      },
    });
  }
}
