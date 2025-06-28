import { IsNotEmpty, IsString } from 'class-validator';
import { OrderEntity } from '../entity/order.entity';

export class CreateOrderDto implements Pick<OrderEntity, 'car_id'> {
  @IsNotEmpty()
  @IsString()
  car_id: string;
}
