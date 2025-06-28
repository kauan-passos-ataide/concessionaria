import { IsEmail, IsString, Length } from 'class-validator';

export class OtpCodeDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsString()
  @Length(6)
  code: string;
}
