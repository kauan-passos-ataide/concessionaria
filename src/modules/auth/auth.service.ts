import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashPassword } from './dto/hashPassword.dto';
import { GenerateJwtToken } from './dto/generate-jwt-token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword({ password, hash }: HashPassword): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateJwtToken(data: GenerateJwtToken): Promise<string> {
    return this.jwtService.signAsync(data);
  }
}
