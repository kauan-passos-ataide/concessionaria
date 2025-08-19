import { $Enums } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import { UserEntity } from '../entity/user.entity';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UserDto implements UserEntity {
  @Exclude()
  id: string;
  @Exclude()
  role: $Enums.Role;
  @Exclude()
  password: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string | undefined }) => value ?? null)
  secret_otp: string | null;

  @IsArray()
  descriptor_face: number[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  cpf: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  @Transform(({ value }: { value: string | undefined }) => value ?? null)
  cnpj: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }: { value: string | undefined }) => value ?? null)
  complement: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  country: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  number_address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  street: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  zip_code: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phone: string;

  @IsNotEmpty()
  created_at: Date;

  @IsNotEmpty()
  update_at: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
