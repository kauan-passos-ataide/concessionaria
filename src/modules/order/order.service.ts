import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { PaymentMethod } from '@prisma/client';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
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
    paymentMethod: PaymentMethod,
  ): Promise<{ order: OrderDto; seller_name: string } | null | undefined> {
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
          return null;
        }
        const order = await tx.order.create({
          data: {
            total_value: car?.price,
            seller_id: car.seller_id,
            purchaser_id: userId,
            car_id: car.id,
            payment_method: paymentMethod,
          },
        });
        const process = this.processPayment(paymentMethod);
        if (process === false) {
          const canceled = await tx.order.update({
            where: { id: order.id },
            data: { status: 'CANCELED' },
          });
          return {
            canceled,
            seller_name: `${car.seller.first_name} ${car.seller.last_name}`,
          };
        }
        const finished = await tx.order.update({
          where: { id: order.id },
          data: { status: 'FINISHED' },
        });
        return {
          finished,
          seller_name: `${car.seller.first_name} ${car.seller.last_name}`,
        };
      });
    } catch {
      return null;
    }
  }

  processPayment(paymentMethod: PaymentMethod): boolean {
    switch (paymentMethod) {
      case 'CREDIT':
        return this.generateRandomBoolean();
        break;
      case 'DEBIT':
        return this.generateRandomBoolean();
        break;
      case 'PIX':
        return this.generateRandomBoolean();
        break;
      default:
        return false;
        break;
    }
  }

  generateRandomBoolean(): boolean {
    const result = Math.random() < 0.5;
    return result;
  }
}
