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
import { getMonth, getYear, parseISO } from 'date-fns';
import { CurrentMonthTestDto } from './dto/currentMonthTest.dto';

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

  @Post('get-orders-test')
  getOrdersTest(@Body() { currentMonth }: CurrentMonthTestDto) {
    const orders = [
      {
        id: '98',
        title: 'Pedido #098',
        date: '2025-06-02',
        client: 'João da Silva',
        value: 150.75,
      },
      {
        id: '76',
        title: 'Pedido #076',
        date: '2025-06-30',
        client: 'Maria Oliveira',
        value: 220.0,
      },
      {
        id: '32',
        title: 'Pedido #032',
        date: '2025-06-21',
        client: 'Maria Oliveira',
        value: 220.0,
      },
      {
        id: '1',
        title: 'Pedido #001',
        date: '2025-06-09',
        client: 'João da Silva',
        value: 150.75,
      },
      {
        id: '2',
        title: 'Pedido #002',
        date: '2025-07-02',
        client: 'Maria Oliveira',
        value: 220.0,
      },
      {
        id: '5',
        title: 'Pedido #005',
        date: '2025-07-02',
        client: 'Maria Oliveira',
        value: 220.0,
      },
      {
        id: '7',
        title: 'Pedido #007',
        date: '2025-07-02',
        client: 'Maria Oliveira',
        value: 220.0,
      },
      {
        id: '10',
        title: 'Pedido #010',
        date: '2025-07-02',
        client: 'Maria Oliveira',
        value: 220.0,
      },
      {
        id: '9',
        title: 'Pedido #009',
        date: '2025-07-02',
        client: 'Maria Oliveira',
        value: 220.0,
      },
      {
        id: '3',
        title: 'Pedido #003',
        date: '2025-07-04',
        client: 'Carlos Santos',
        value: 80.5,
      },
    ];
    const date = new Date(currentMonth);
    const targetMonth = getMonth(date);
    const targetYear = getYear(date);
    const ordersFiltered = orders.filter((order) => {
      const orderDate = parseISO(order.date);
      return (
        getMonth(orderDate) === targetMonth && getYear(orderDate) === targetYear
      );
    });
    return { orders: ordersFiltered };
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
