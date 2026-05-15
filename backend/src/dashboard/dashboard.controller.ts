import { Controller, Get } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(Role.ADMIN, Role.TECHADMIN)
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('employee')
  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.TECHADMIN)
  getEmployeeDashboard() {
    return this.dashboardService.getEmployeeDashboard();
  }
}
