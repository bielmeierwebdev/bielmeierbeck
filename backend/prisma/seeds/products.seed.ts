import { PrismaClient, ProductCategory, ProductType } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  const products = [
    {
      name: 'Breze',
      type: ProductType.STANDARD,
      category: ProductCategory.BACKWARE,
      active: true,
      price: 1.2,
    },

    {
      name: 'Kaisersemmel',
      type: ProductType.STANDARD,
      category: ProductCategory.BACKWARE,
      active: true,
      price: 0.9,
    },

    {
      name: 'Croissant',
      type: ProductType.STANDARD,
      category: ProductCategory.BACKWARE,
      active: true,
      price: 1.8,
    },

    {
      name: 'Schokocroissant',
      type: ProductType.SPECIAL,
      category: ProductCategory.SUESSWARE,
      active: true,
      price: 2.5,
    },

    {
      name: 'Nussschnecke',
      type: ProductType.SPECIAL,
      category: ProductCategory.SUESSWARE,
      active: false,
      price: 3.2,
    },

    {
      name: 'Apfeltasche',
      type: ProductType.SPECIAL,
      category: ProductCategory.SUESSWARE,
      active: true,
      price: 2.9,
    },

    {
      name: 'Käsebreze',
      type: ProductType.SPECIAL,
      category: ProductCategory.BACKWARE,
      active: true,
      price: 2.8,
    },

    {
      name: 'Belegte Breze',
      type: ProductType.SPECIAL,
      category: ProductCategory.BACKWARE,
      active: false,
      price: 4.5,
    },

    {
      name: 'Baguette',
      type: ProductType.STANDARD,
      category: ProductCategory.BACKWARE,
      active: true,
      price: 3.5,
    },

    {
      name: 'Laugenstange',
      type: ProductType.STANDARD,
      category: ProductCategory.BACKWARE,
      active: true,
      price: 1.1,
    },

    {
      name: 'Zimtschnecke',
      type: ProductType.SPECIAL,
      category: ProductCategory.SUESSWARE,
      active: true,
      price: 3.4,
    },

    {
      name: 'Mohnschnecke',
      type: ProductType.SPECIAL,
      category: ProductCategory.SUESSWARE,
      active: true,
      price: 3.1,
    },

    {
      name: 'Butterhörnchen',
      type: ProductType.STANDARD,
      category: ProductCategory.BACKWARE,
      active: true,
      price: 1.6,
    },

    {
      name: 'Rosinenbrötchen',
      type: ProductType.STANDARD,
      category: ProductCategory.SUESSWARE,
      active: true,
      price: 1.9,
    },

    {
      name: 'Nussstange',
      type: ProductType.SPECIAL,
      category: ProductCategory.SUESSWARE,
      active: false,
      price: 3.7,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,

        type: product.type,

        category: product.category,

        active: product.active,

        prices: {
          create: {
            price: product.price,
          },
        },
      },
    });
  }
}
