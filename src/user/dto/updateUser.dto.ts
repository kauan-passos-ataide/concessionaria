import { IsOptional, IsString, MaxLength } from 'class-validator';
import { UserEntity } from '../entity/user.entity';

export class UpdateUser implements Partial<UserEntity> {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  last_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  cpf?: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  cnpj?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  complement?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  neighborhood?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  number_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  street?: string;

  @IsOptional()
  @IsString()
  @MaxLength(9)
  zip_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  phone?: string;
}
