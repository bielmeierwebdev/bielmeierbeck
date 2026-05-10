import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from '@nestjs/common';

import { SpecialOrdersService } from './special-orders.service';
import { CreateSpecialOrderDto } from './dto/create-special-order.dto';

@Controller('special-orders')
export class SpecialOrdersController {
  constructor(private readonly specialOrdersService: SpecialOrdersService) {}

  @Get()
  findAll() {
    return this.specialOrdersService.findAll();
  }

  @Post()
  create(
    @Body()
    body: CreateSpecialOrderDto,
  ) {
    return this.specialOrdersService.create({
      ...body,

      pickupDate: body.pickupDate,
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: CreateSpecialOrderDto,
  ) {
    return this.specialOrdersService.update(
      id,

      {
        ...body,

        pickupDate: body.pickupDate,
      },
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.specialOrdersService.remove(id);
  }
}
