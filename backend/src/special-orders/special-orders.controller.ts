import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { SpecialOrdersService } from './special-orders.service';

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
    body: any,
  ) {
    return this.specialOrdersService.create(body);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.specialOrdersService.remove(id);
  }
}
