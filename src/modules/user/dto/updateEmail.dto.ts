import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateEmail {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  currentEmail: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  email: string;
}
