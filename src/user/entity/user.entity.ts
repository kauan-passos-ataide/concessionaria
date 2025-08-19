import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  secret_otp: string | null;
  descriptor_face: number[];
  role: $Enums.Role;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  cpf: string;
  cnpj: string | null;
  city: string;
  complement: string | null;
  country: string;
  neighborhood: string;
  number_address: string;
  state: string;
  street: string;
  zip_code: string;
  phone: string;
  created_at: Date;
  update_at: Date;
}
