import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class FindSoldCarsDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  page: number;
}
