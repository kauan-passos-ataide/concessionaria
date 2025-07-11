import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashPassword } from './dto/hashPassword.dto';
import { GenerateJwtToken } from './dto/generate-jwt-token.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/interfaces/jwtPayload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword({ password, hash }: HashPassword): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateJwtToken(data: GenerateJwtToken): Promise<string> {
    return this.jwtService.signAsync(data);
  }

  async verifyJwt(jwtPayload: JwtPayload): Promise<true | false> {
    try {
      const { email, id } = jwtPayload;
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (user?.id === id) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async getPayload(token: string): Promise<JwtPayload> {
    const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return payload;
  }
}
