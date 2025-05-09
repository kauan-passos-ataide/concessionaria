import { Decimal } from '@prisma/client/runtime/library';
import { CarEntity } from '../entity/car.entity';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCarDto
  implements
    Pick<
      CarEntity,
      'name' | 'color' | 'description' | 'model' | 'price' | 'year'
    >
{
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
  price: Decimal;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(9999)
  year: number;
}
