import { Controller, Get, Body, Post } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
}
