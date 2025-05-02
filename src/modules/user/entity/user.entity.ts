import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @Exclude()
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  cnpj: string | null;
  city: string;
  complement: string | null;
  country: string;
  neighborhood: string;
  numberAddress: string;
  state: string;
  street: string;
  zipCode: string;
  phone: string;
  createdAt: Date;
  updateAt: Date;

  @Exclude()
  role: $Enums.Role;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
