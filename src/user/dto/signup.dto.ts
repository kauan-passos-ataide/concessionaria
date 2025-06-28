import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { UserEntity } from '../entity/user.entity';
import { Transform } from 'class-transformer';

export class SignUpDto
  implements
    Pick<
      UserEntity,
      | 'first_name'
      | 'last_name'
      | 'email'
      | 'cpf'
      | 'cnpj'
      | 'password'
      | 'city'
      | 'complement'
      | 'country'
      | 'neighborhood'
      | 'number_address'
      | 'state'
      | 'street'
      | 'zip_code'
      | 'phone'
    >
{
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
  @Length(8, 30)
  password: string;

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
}
