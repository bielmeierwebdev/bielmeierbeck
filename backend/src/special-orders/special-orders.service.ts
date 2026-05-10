import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SpecialOrdersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.specialOrder.findMany({
      orderBy: {
        pickupDate: 'asc',
      },
    });
  }

  create(data: Prisma.SpecialOrderCreateInput) {
    return this.prisma.specialOrder.create({
      data,
    });
  }

  update(
    id: number,

    data: Prisma.SpecialOrderUpdateInput,
  ) {
    return this.prisma.specialOrder.update({
      where: {
        id,
      },

      data,
    });
  }

  async remove(id: number) {
    const order = await this.prisma.specialOrder.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new Error('Special order not found');
    }

    return this.prisma.specialOrder.delete({
      where: {
        id,
      },
    });
  }
}
