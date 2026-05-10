import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.employee.findMany({
      include: {
        files: true,
      },

      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.employee.findUnique({
      where: {
        id,
      },

      include: {
        files: true,
      },
    });
  }

  update(id: number, dto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: {
        id,
      },

      data: dto,
    });
  }

  addFile(
    employeeId: number,

    file: {
      name: string;
      path: string;
    },
  ) {
    return this.prisma.employeeFile.create({
      data: {
        employeeId,

        name: file.name,

        path: file.path,
      },
    });
  }
}
