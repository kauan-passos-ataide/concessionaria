import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { RequestWithUser } from '../common/interfaces/requestWithUser.interface';
import { OrderService } from './order.service';
import { UserService } from '../user/user.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  @Post('create-order')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: RequestWithUser,
  ): Promise<{ sessionId: string }> {
    const user = await this.userService.findById(req.user.id);
    if (!user || user.email !== req.user.email) {
      throw new UnauthorizedException();
    }
    const sessionId = await this.orderService.createOrder(
      createOrderDto,
      req.user.id,
    );
    if (!sessionId) {
      throw new BadRequestException();
    }
    return { sessionId };
  }
}
