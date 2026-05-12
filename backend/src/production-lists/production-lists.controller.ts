import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { ProductionListsService } from './production-lists.service';

import { CreateProductionListDto } from './dto/create-production-list.dto';

@Controller('production-lists')
export class ProductionListsController {
  constructor(
    private readonly productionListsService: ProductionListsService,
  ) {}

  @Get('saturday')
  async getSaturdayList() {
    return this.productionListsService.getSaturdayList();
  }

  @Post()
  async create(@Body() body: CreateProductionListDto) {
    return this.productionListsService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,

    @Body() body: CreateProductionListDto,
  ) {
    return this.productionListsService.update(Number(id), body);
  }
}
