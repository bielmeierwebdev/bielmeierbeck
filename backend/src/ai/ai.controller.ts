import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('parse-order')
  parseOrder(
    @Body('text')
    text: string,

    @Body('products')
    products: string[],
  ) {
    return this.aiService.parseOrder(
      text,

      products,
    );
  }
}
