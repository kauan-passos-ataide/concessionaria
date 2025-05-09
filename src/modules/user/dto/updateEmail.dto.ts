import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateEmail {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  current_email: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  email: string;
}
