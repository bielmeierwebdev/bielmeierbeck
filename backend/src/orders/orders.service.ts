import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,

        items: {
          include: {
            product: true,
          },
        },
      },

      orderBy: {
        pickupDate: 'asc',
      },
    });
  }

  create(data: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        customerId: data.customerId,

        pickupDate: new Date(data.pickupDate),

        paid: data.paid,

        notes: data.notes,

        items: {
          create: data.items.map((item: CreateOrderItemDto) => ({
            productId: item.productId,

            quantity: item.quantity,

            unitPrice: item.unitPrice,
          })),
        },
      },

      include: {
        customer: true,

        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async completeSaturdayOrders() {
    const now = new Date();

    const currentDay = now.getDay();

    const diff = currentDay === 6 ? 0 : 6 - currentDay;

    const saturday = new Date(now);

    saturday.setDate(now.getDate() + diff);

    saturday.setHours(0, 0, 0, 0);

    const saturdayEnd = new Date(saturday);

    saturdayEnd.setHours(23, 59, 59, 999);

    return this.prisma.order.updateMany({
      where: {
        pickupDate: {
          gte: saturday,

          lte: saturdayEnd,
        },

        completed: false,
      },

      data: {
        completed: true,

        paid: true,
      },
    });
  }

  delete(id: number) {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,

    data: CreateOrderDto,
  ) {
    await this.prisma.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    return this.prisma.order.update({
      where: {
        id,
      },

      data: {
        customerId: data.customerId,

        pickupDate: new Date(data.pickupDate),

        paid: data.paid,

        notes: data.notes,

        items: {
          create: data.items.map((item) => ({
            productId: item.productId,

            quantity: item.quantity,

            unitPrice: item.unitPrice,
          })),
        },
      },

      include: {
        customer: true,

        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
