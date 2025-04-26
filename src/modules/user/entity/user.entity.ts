import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @Exclude()
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  createdAt: Date;
  updateAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
