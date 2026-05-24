import { Module } from '@nestjs/common';
import { DashboardController } from './employees-dashboard.controller';
import { DashboardService } from './employees-dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
