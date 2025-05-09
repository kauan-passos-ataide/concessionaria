import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePassword {
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  current_password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
