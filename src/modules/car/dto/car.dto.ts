import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CarEntity } from '../entity/car.entity';

export class CarDto implements CarEntity {
  @Exclude()
  seller_id: string;

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

  @Transform(({ value }) => Number(value))
  price: Decimal;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(9999)
  year: number;

  constructor(partial: Partial<CarDto>) {
    Object.assign(this, partial);
  }
}
