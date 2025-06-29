import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateSessionDto } from './dto/createSession.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') as string,
      {
        apiVersion: '2025-05-28.basil',
      },
    );
  }

  async createCheckoutSession(createSessionDto: CreateSessionDto) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/',
        line_items: [
          {
            price_data: {
              currency: 'brl',
              unit_amount: Math.round(
                Number(createSessionDto.product_amount) * 100,
              ),
              product_data: {
                name: createSessionDto.name_product,
              },
            },
            quantity: createSessionDto.quantity,
          },
        ],
        metadata: {
          order_id: createSessionDto.order_id,
        },
      });

      return session;
    } catch (err) {
      console.error(err);
    }
  }
}
