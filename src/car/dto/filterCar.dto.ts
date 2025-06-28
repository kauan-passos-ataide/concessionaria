import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class FilterCarDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  model?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  minYear?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  maxYear?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  minPrice?: Decimal;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  maxPrice?: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  page: number;
}
