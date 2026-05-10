import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

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

  create(data: any) {
    return this.prisma.specialOrder.create({
      data,
    });
  }

  remove(id: number) {
    return this.prisma.specialOrder.delete({
      where: {
        id,
      },
    });
  }
}
