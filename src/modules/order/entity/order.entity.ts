import { $Enums, Order } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class OrderEntity implements Order {
  id: string;
  car_id: string;
  payment_method: $Enums.PaymentMethod;
  seller_id: string;
  created_at: Date;
  purchaser_id: string;
  status: $Enums.Status;
  total_value: Decimal;
  order_number: number;
}
