import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  order_id: string;

  @IsString()
  name_product: string;

  @IsNumber()
  product_amount: number;

  @IsInt()
  quantity: number;
}
