import { PrismaClient, Role } from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { seedCustomers } from './seeds/customers.seed';

import { seedProducts } from './seeds/products.seed';

import { seedEmployees } from './seeds/employees.seed';

import { seedAllOrders } from './seeds/allOrders.seed';

import { seedSpecialOrders } from './seeds/specialOrders.seed';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || 'admin123',
    10,
  );

  // TECHADMIN
  await prisma.user.upsert({
    where: {
      username: 'sophie',
    },

    update: {},

    create: {
      username: 'sophie',

      password: defaultPassword,

      role: Role.TECHADMIN,
    },
  });

  // ADMIN
  await prisma.user.upsert({
    where: {
      username: 'patrick',
    },

    update: {},

    create: {
      username: 'patrick',

      password: defaultPassword,

      role: Role.ADMIN,
    },
  });

  // ADMIN
  await prisma.user.upsert({
    where: {
      username: 'anna',
    },

    update: {},

    create: {
      username: 'anna',

      password: defaultPassword,

      role: Role.ADMIN,
    },
  });

  // EMPLOYEE
  await prisma.user.upsert({
    where: {
      username: 'julia',
    },

    update: {},

    create: {
      username: 'julia',

      password: defaultPassword,

      role: Role.EMPLOYEE,
    },
  });

  await prisma.user.upsert({
    where: {
      username: 'melanie',
    },

    update: {},

    create: {
      username: 'melanie',

      password: defaultPassword,

      role: Role.EMPLOYEE,
    },
  });

  await prisma.user.upsert({
    where: {
      username: 'maria',
    },

    update: {},

    create: {
      username: 'maria',

      password: defaultPassword,

      role: Role.EMPLOYEE,
    },
  });

  await prisma.user.upsert({
    where: {
      username: 'sophie',
    },

    update: {},

    create: {
      username: 'sophie',

      password: defaultPassword,

      role: Role.TECHADMIN,
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
