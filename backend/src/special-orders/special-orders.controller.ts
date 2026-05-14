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

import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TECHADMIN, Role.EMPLOYEE)
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

      pickupDate: new Date(body.pickupDate),
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

        pickupDate: new Date(body.pickupDate),
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
