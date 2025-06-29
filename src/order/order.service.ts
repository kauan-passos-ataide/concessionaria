import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}
  // caso estorne o dinheiro, eu coloco o status do pedido para cancelado
  // primeiramente crio o pedido, depois eu "processo a compra", caso dê certo, eu mudo o status de created para finished e retorno as seguintes informações:
  // número do pedido
  // valor total
  // status
  // nome do vendedor
  // id do veiculo comprado

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<string | undefined> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const car = await this.prisma.car.findUnique({
          where: { id: createOrderDto.car_id },
          include: {
            seller: {
              select: { first_name: true, last_name: true },
            },
          },
        });
        if (!car) {
          return undefined;
        }
        const order = await tx.order.create({
          data: {
            total_value: car?.price,
            seller_id: car.seller_id,
            purchaser_id: userId,
            car_id: car.id,
          },
        });
        const sessionId = this.stripeService.createCheckoutSession({
          order_id: order.id,
          name_product: car.name,
          product_amount: Number(order.total_value),
          quantity: 1,
        });
        return sessionId;
      });
    } catch {
      return undefined;
    }
  }
}
