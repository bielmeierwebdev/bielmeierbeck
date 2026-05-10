import { PrismaClient } from '@prisma/client';

export async function seedAllOrders(prisma: PrismaClient) {
  const customers = await prisma.customer.findMany();

  const products = await prisma.product.findMany({
    include: {
      prices: {
        orderBy: {
          validFrom: 'desc',
        },
      },
    },
  });

  if (!customers.length || !products.length) {
    return;
  }

  await prisma.order.createMany({
    data: [],
  });

  const orders = [
    {
      customerIndex: 0,

      pickupDate: new Date('2026-05-16T08:00:00'),

      paid: true,

      special: false,

      notes: 'Bitte alles geschnitten',

      items: [
        {
          productIndex: 0,

          quantity: 10,
        },

        {
          productIndex: 1,

          quantity: 5,
        },
      ],
    },

    {
      customerIndex: 1,

      pickupDate: new Date('2026-05-16T09:30:00'),

      paid: false,

      special: true,

      notes: 'Extra knusprig',

      items: [
        {
          productIndex: 3,

          quantity: 4,
        },

        {
          productIndex: 6,

          quantity: 2,
        },
      ],
    },

    {
      customerIndex: 2,

      pickupDate: new Date('2026-05-17T07:45:00'),

      paid: true,

      special: false,

      notes: '',

      items: [
        {
          productIndex: 8,

          quantity: 3,
        },

        {
          productIndex: 9,

          quantity: 6,
        },
      ],
    },

    {
      customerIndex: 3,

      pickupDate: new Date('2026-05-16T10:15:00'),

      paid: false,

      special: true,

      notes: 'Geburtstagsfeier',

      items: [
        {
          productIndex: 10,

          quantity: 8,
        },

        {
          productIndex: 11,

          quantity: 8,
        },
      ],
    },
  ];

  for (const order of orders) {
    await prisma.order.create({
      data: {
        customerId: customers[order.customerIndex]?.id,

        pickupDate: order.pickupDate,

        paid: order.paid,

        special: order.special,

        notes: order.notes,

        items: {
          create: order.items.map((item) => {
            const product = products[item.productIndex];

            return {
              productId: product.id,

              quantity: item.quantity,

              unitPrice: product.prices[0].price,
            };
          }),
        },
      },
    });
  }
}
