import { Body, Controller, Post } from '@nestjs/common';

@Controller('order')
export class OrderController {
  @Post()
  async creditCard(@Body()): Promise<{ oderNumber: number }> {}

  @Post()
  async debitCard(@Body()): Promise<{ oderNumber: number }> {}

  @Post()
  async pix(@Body()): Promise<{ oderNumber: number }> {}
}
