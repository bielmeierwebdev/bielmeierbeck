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
    const now = new Date();
    const day = now.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);
    nextSaturday.setHours(0, 0, 0, 0);
    const nextSaturdayEnd = new Date(nextSaturday);
    nextSaturdayEnd.setHours(23, 59, 59, 999);

    return this.prisma.productionList.findFirst({
      where: {
        date: {
          gte: nextSaturday,
          lte: nextSaturdayEnd,
        },
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateProductionListDto) {
    return this.prisma.productionList.create({
      data: {
        date: new Date(data.date), // ← aus dem Payload nehmen!
        items: {
          create: data.items.map((item: ProductionItem) => ({
            productName: item.name,
            orderedQuantity: item.ordered,
            productionAmount: item.production,
          })),
        },
      },
      include: { items: true },
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
