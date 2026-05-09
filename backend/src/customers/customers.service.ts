import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

import { CreateCustomerDto } from './dto/create-costumer.dto';
import { UpdateCustomerDto } from './dto/update-costumer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: {
        id,
      },
    });
  }

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: dto,
    });
  }

  update(id: number, dto: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  delete(id: number) {
    return this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
