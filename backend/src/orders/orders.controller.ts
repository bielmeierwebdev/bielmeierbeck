import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TECHADMIN, Role.EMPLOYEE)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  create(
    @Body()
    body: CreateOrderDto,
  ) {
    return this.ordersService.create(body);
  }

  @Patch('complete-saturday')
  completeSaturdayOrders() {
    return this.ordersService.completeSaturdayOrders();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body()
    body: CreateOrderDto,
  ) {
    return this.ordersService.update(Number(id), body);
  }
}
