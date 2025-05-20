import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../modules/user/user.module';
import { CarModule } from '../modules/car/car.module';
import { OrderModule } from '../modules/order/order.module';
import { AuthModule } from '../modules/auth/auth.module';
import { AppController } from './app.controller';
import * as dotenv from 'dotenv';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
