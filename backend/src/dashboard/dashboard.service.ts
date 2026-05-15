import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();

    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const orders = await this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const specialOrdersCount = await this.prisma.specialOrder.count();

    const nextWeekOrders = orders.filter((order) => {
      const pickup = new Date(order.pickupDate);

      return pickup >= now && pickup <= nextWeek;
    });

    const nextWeekRevenue = nextWeekOrders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce(
          (itemSum, item) => itemSum + item.quantity * Number(item.unitPrice),
          0,
        )
      );
    }, 0);

    const monthlyRevenueMap = new Map<string, number>();
    const monthlyOrdersMap = new Map<string, number>();
    const backwareMap = new Map<string, number>();

    const suesswareMap = new Map<string, number>();

    orders.forEach((order) => {
      const date = new Date(order.pickupDate);

      const monthLabel = date.toLocaleDateString('de-DE', {
        month: 'short',
      });

      const revenue = order.items.reduce(
        (sum, item) => sum + item.quantity * Number(item.unitPrice),
        0,
      );

      monthlyRevenueMap.set(
        monthLabel,
        (monthlyRevenueMap.get(monthLabel) || 0) + revenue,
      );

      monthlyOrdersMap.set(
        monthLabel,
        (monthlyOrdersMap.get(monthLabel) || 0) + 1,
      );

      order.items.forEach((item) => {
        console.log(item.product);

        const name = item.product.name;

        const category = item.product.category;

        const map = category === 'SUESSWARE' ? suesswareMap : backwareMap;

        map.set(name, (map.get(name) || 0) + item.quantity);
      });
    });

    const topBackware = [...backwareMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topSuessware = [...suesswareMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    console.log('BACKWARE', topBackware);

    console.log('SUESSWARE', topSuessware);

    return {
      stats: {
        nextWeekOrders: nextWeekOrders.length,

        nextWeekRevenue,

        specialOrders: specialOrdersCount,
      },

      revenueChart: {
        labels: [...monthlyRevenueMap.keys()],
        data: [...monthlyRevenueMap.values()],
      },

      ordersChart: {
        labels: [...monthlyOrdersMap.keys()],
        data: [...monthlyOrdersMap.values()],
      },

      topProducts: {
        BACKWARE: {
          labels: topBackware.map((p) => p[0]),

          data: topBackware.map((p) => p[1]),
        },

        SUESSWARE: {
          labels: topSuessware.map((p) => p[0]),

          data: topSuessware.map((p) => p[1]),
        },
      },
    };
  }

  async getEmployeeDashboard() {
    const now = new Date();

    const day = now.getDay();

    const daysUntilSaturday = day === 6 ? 0 : 6 - day;

    const saturday = new Date();

    saturday.setDate(now.getDate() + daysUntilSaturday);

    saturday.setHours(0, 0, 0, 0);

    const saturdayEnd = new Date(saturday);

    saturdayEnd.setHours(23, 59, 59, 999);

    // Bestellungen Samstag
    const saturdayOrders = await this.prisma.order.findMany({
      where: {
        pickupDate: {
          gte: saturday,
          lte: saturdayEnd,
        },
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Sonderbestellungen Samstag
    const specialOrders = await this.prisma.specialOrder.findMany({
      where: {
        pickupDate: {
          gte: saturday,
          lte: saturdayEnd,
        },
      },

      orderBy: {
        pickupTime: 'asc',
      },
    });

    // Süßwaren
    const saturdaySweets = await this.prisma.product.findMany({
      where: {
        category: 'SUESSWARE',

        active: true,

        deleted: false,
      },
    });

    // Bestellte Mengen berechnen
    const sweetOrderMap = new Map<string, number>();

    saturdayOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.product.category === 'SUESSWARE') {
          const current = sweetOrderMap.get(item.product.name) || 0;

          sweetOrderMap.set(item.product.name, current + item.quantity);
        }
      });
    });

    const sweetsWithOrders = saturdaySweets.map((sweet) => ({
      ...sweet,

      ordered: sweetOrderMap.get(sweet.name) || 0,
    }));

    // Produktionsstatus
    const productionMap = new Map<string, number>();

    saturdayOrders.forEach((order) => {
      order.items.forEach((item) => {
        const current = productionMap.get(item.product.name) || 0;

        productionMap.set(item.product.name, current + item.quantity);
      });
    });

    const productionStatus = [...productionMap.entries()]
      .map(([product, ordered]) => ({
        product,

        ordered,

        produced: 0,
      }))
      .sort((a, b) => b.ordered - a.ordered);

    return {
      stats: {
        saturdayOrders: saturdayOrders.length,

        specialOrders: specialOrders.length,
      },

      specialOrders,

      saturdaySweets: sweetsWithOrders,

      productionStatus,
    };
  }
}
