import { IsEmail, IsString, Length } from 'class-validator';
import { UserEntity } from '../entity/user.entity';

export class SignUpDto
  implements
    Pick<UserEntity, 'firstName' | 'lastName' | 'email' | 'cpf' | 'password'>
{
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  cpf: string;

  @IsString()
  @Length(6, 30)
  password: string;
}
