import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getEmployeeDashboard() {
    const now = new Date();

    // Nächsten Samstag berechnen
    const nextSaturday = new Date(now);
    const day = now.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);
    nextSaturday.setHours(0, 0, 0, 0);
    const nextSaturdayEnd = new Date(nextSaturday);
    nextSaturdayEnd.setHours(23, 59, 59, 999);

    // Bestellungen für Samstag
    const saturdayOrders = await this.prisma.order.findMany({
      where: {
        pickupDate: {
          gte: nextSaturday,
          lte: nextSaturdayEnd,
        },
        completed: false,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Sonderbestellungen für Samstag
    const specialOrders = await this.prisma.specialOrder.findMany({
      where: {
        pickupDate: {
          gte: nextSaturday,
          lte: nextSaturdayEnd,
        },
      },
      orderBy: { pickupTime: 'asc' },
    });

    // Süßwaren aus Samstagsbestellungen aggregieren
    const sweetsMap = new Map<string, number>();
    for (const order of saturdayOrders) {
      for (const item of order.items) {
        if (item.product.category === 'SUESSWARE') {
          const current = sweetsMap.get(item.product.name) ?? 0;
          sweetsMap.set(item.product.name, current + item.quantity);
        }
      }
    }
    const saturdaySweets = Array.from(sweetsMap.entries()).map(
      ([name, ordered]) => ({ name, ordered }),
    );

    // Neueste Produktionsliste für Samstag
    const productionList = await this.prisma.productionList.findFirst({
      where: {
        date: {
          gte: nextSaturday,
          lte: nextSaturdayEnd,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    console.log('Production List:', productionList);

    const productionStatus = productionList
      ? productionList.items.map((item) => ({
          product: item.productName,
          ordered: item.orderedQuantity,
          produced: item.productionAmount,
        }))
      : [];

    return {
      stats: {
        saturdayOrders: saturdayOrders.length,
        specialOrders: specialOrders.length,
      },
      saturdaySweets,
      specialOrders,
      productionStatus,
    };
  }
}
