import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './employees-dashboard.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('employee')
  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.TECHADMIN)
  getEmployeeDashboard() {
    return this.dashboardService.getEmployeeDashboard();
  }
}
