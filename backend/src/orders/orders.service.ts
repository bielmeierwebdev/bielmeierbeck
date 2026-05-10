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
}
