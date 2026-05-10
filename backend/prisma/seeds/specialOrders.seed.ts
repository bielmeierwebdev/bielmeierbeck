import { PrismaClient } from '@prisma/client';

export async function seedSpecialOrders(prisma: PrismaClient) {
  const orders = [
    {
      title: 'Geburtstag Müller',

      pickupDate: new Date('2026-05-12'),

      pickupTime: '08:00',

      notes: '40 Brezen',
    },

    {
      title: 'Taufe Weber',

      pickupDate: new Date('2026-05-18'),

      pickupTime: '09:30',

      notes: 'Süßwaren extra',
    },

    {
      title: 'Firmenfeier Baufirma Schmid',

      pickupDate: new Date('2026-05-24'),

      pickupTime: '07:00',

      notes: '120 Semmeln',
    },

    {
      title: 'Hochzeit Fischer',

      pickupDate: new Date('2026-05-27'),

      pickupTime: '06:30',

      notes: 'Große Frühstücksplatten',
    },
  ];

  for (const order of orders) {
    await prisma.specialOrder.create({
      data: order,
    });
  }
}
