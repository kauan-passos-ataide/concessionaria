import { Car } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class CarEntity implements Car {
  id: string;
  name: string;
  color: string;
  description: string;
  model: string;
  price: Decimal;
  year: number;
  stock: number;
  seller_id: string;
}
