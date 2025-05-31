import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { OrderEntity } from '../entity/order.entity';
import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Transform } from 'class-transformer';

export class OrderDto implements OrderEntity {
  @Exclude()
  seller_id: string;

  @Exclude()
  purchaser_id: string;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  payment_method: $Enums.PaymentMethod;

  @IsNotEmpty()
  @IsDate()
  created_at: Date;

  @IsNotEmpty()
  @IsInt()
  order_number: number;

  @IsNotEmpty()
  @IsString()
  status: $Enums.Status;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(9999999999.99)
  @Transform(({ value }) => Number(value))
  total_value: Decimal;

  @IsNotEmpty()
  @IsString()
  car_id: string;
}
