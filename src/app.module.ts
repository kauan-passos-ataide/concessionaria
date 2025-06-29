import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CarModule } from './car/car.module';
import { OrderModule } from './order/order.module';
import { AppController } from './app.controller';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.production',
    }),
    PrismaModule,
    UserModule,
    CarModule,
    OrderModule,
    AuthModule,
    StripeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
