import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma/prisma.service';
import { StripeModule } from '../stripe/stripe.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [StripeModule, UserModule],
  providers: [OrderService, PrismaService],
  controllers: [OrderController],
})
export class OrderModule {}
