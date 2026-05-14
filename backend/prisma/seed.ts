import { PrismaClient, Role } from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { seedCustomers } from './seeds/customers.seed';

import { seedProducts } from './seeds/products.seed';

import { seedEmployees } from './seeds/employees.seed';

import { seedAllOrders } from './seeds/allOrders.seed';

import { seedSpecialOrders } from './seeds/specialOrders.seed';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD!,
    10,
  );

  await prisma.user.upsert({
    where: {
      email: 'admin@test.de',
    },

    update: {},

    create: {
      email: 'admin@test.de',

      password: hashedPassword,

      role: Role.ADMIN,
    },
  });

  await seedEmployees();

  await seedCustomers(prisma);

  await seedProducts(prisma);

  await seedAllOrders(prisma);

  await seedSpecialOrders(prisma);

  console.log('Seed erfolgreich 🌱');
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
