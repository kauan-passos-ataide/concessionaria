import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';

@Controller('order')
export class OrderController {
  @Post()
  async creditCard(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ OrderDto; seller_name: string }> {}

  @Post()
  async debitCard(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ OrderDto; seller_name: string }> {}

  @Post()
  async pix(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ OrderDto; seller_name: string }> {}
}
