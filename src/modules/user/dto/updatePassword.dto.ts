import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePassword {
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
