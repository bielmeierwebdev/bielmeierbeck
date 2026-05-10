import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,

        type: dto.type,

        category: dto.category,

        active: dto.active,

        prices: {
          create: {
            price: dto.price,
          },
        },
      },

      include: {
        prices: true,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        prices: {
          orderBy: {
            validFrom: 'desc',
          },
        },
      },

      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        prices: {
          orderBy: {
            validFrom: 'desc',
          },
        },
      },
    });
  }

  update(id: number, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: {
        id,
      },

      data: {
        name: dto.name,

        type: dto.type,

        category: dto.category,

        active: dto.active,
      },
    });
  }

  async updatePrice(id: number, price: number) {
    return this.prisma.productPrice.create({
      data: {
        productId: id,

        price,
      },
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
