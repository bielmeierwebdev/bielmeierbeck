import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user as {
      userId: number;
      email: string;
      role: string;
    };
  }
}
