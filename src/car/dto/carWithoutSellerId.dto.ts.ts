import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CarWithoutSellerIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  color: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  model: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(9999999999.99)
  @Transform(({ value }) => Number(value))
  price: Decimal;

  @IsNotEmpty()
  @IsInt()
  @Min(1000)
  @Max(9999)
  year: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  constructor(partial: Partial<CarWithoutSellerIdDto>) {
    Object.assign(this, partial);
  }
}
