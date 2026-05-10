import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedEmployees() {
  await prisma.employee.createMany({
    data: [
      {
        name: 'Patrick Bielmeier',

        role: 'Chef',

        avatar: 'https://i.pravatar.cc/300?img=12',

        phone: '017612345005',

        email: 'patrick@bielmeierbeck.de',
      },
      {
        name: 'Anna Bielmeier',

        role: 'Chefin',

        avatar: 'https://i.pravatar.cc/300?img=15',

        phone: '017612345006',

        email: 'anna@bielmeierbeck.de',
      },
      {
        name: 'Maria Bielmeier',

        role: 'Verkauf Chefin',

        avatar: 'https://i.pravatar.cc/300?img=1',

        phone: '017612345001',

        email: 'maria@bielmeierbeck.de',
      },

      {
        name: 'Sophie Bielmeier',

        role: 'Marketing',

        avatar: 'https://i.pravatar.cc/300?img=5',

        phone: '017612345002',

        email: 'sophie@bielmeierbeck.de',
      },

      {
        name: 'Julia Bielmeier',

        role: 'Verkauf',

        avatar: 'https://i.pravatar.cc/300?img=9',

        phone: '017612345003',

        email: 'julia@bielmeierbeck.de',
      },

      {
        name: 'Melanie Rackl',

        role: 'Verkauf',

        avatar: 'https://i.pravatar.cc/300?img=10',

        phone: '017612345004',

        email: 'melanie@bielmeierbeck.de',
      },
    ],
  });

  console.log('Employees Seed erfolgreich 🌱');
}
