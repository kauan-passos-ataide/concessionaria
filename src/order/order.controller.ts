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
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Public } from '../common/decorators/public.decorator';

@Controller('order')
export class OrderController {
  private stripe: Stripe;
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') as string,
      {
        apiVersion: '2025-05-28.basil',
      },
    );
  }

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

  @Post('webhooks/stripe')
  @Public()
  handleStripeWebhook(@Req() req: Request, @Body() body: any) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    ) as string;

    let event: Stripe.Event;
    const signature = req.headers['stripe-signature'] as string;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
      );
    } catch {
      throw new BadRequestException();
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const payment = event.data.object;
        console.log('💰 Pagamento concluído:', payment);
        break;
      }

      default:
        console.log('evento não tratado');
    }

    return { received: true };
  }
}
