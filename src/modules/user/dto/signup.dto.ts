import {
  IsEmail,
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
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'cpf'
      | 'cnpj'
      | 'password'
      | 'city'
      | 'complement'
      | 'country'
      | 'neighborhood'
      | 'numberAddress'
      | 'state'
      | 'street'
      | 'zipCode'
      | 'phone'
    >
{
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @MaxLength(15)
  cpf: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  @Transform(({ value }: { value: string | undefined }) => value ?? null)
  cnpj: string | null;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsString()
  @MaxLength(50)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }: { value: string | undefined }) => value ?? null)
  complement: string | null;

  @IsString()
  @MaxLength(50)
  country: string;

  @IsString()
  @MaxLength(50)
  neighborhood: string;

  @IsString()
  @MaxLength(10)
  numberAddress: string;

  @IsString()
  @MaxLength(50)
  state: string;

  @IsString()
  @MaxLength(100)
  street: string;

  @IsString()
  @MaxLength(9)
  zipCode: string;

  @IsString()
  @MaxLength(15)
  phone: string;
}
