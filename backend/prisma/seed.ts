import { PrismaClient } from '@prisma/client';

import { seedCustomers } from './seeds/customers.seed';
import { seedProducts } from './seeds/products.seed';
import { seedEmployees } from './seeds/employees.seed';

const prisma = new PrismaClient();

async function main() {
  await seedEmployees();

  await seedCustomers(prisma);

  await seedProducts(prisma);

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
