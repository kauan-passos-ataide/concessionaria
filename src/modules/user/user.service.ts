import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entity/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto): Promise<string | null> {
    try {
      const user = await this.findByEmail(loginDto.email);
      if (!user) {
        return null;
      }
      const verifyPassword = await this.authService.comparePassword({
        password: user.password,
        hash: loginDto.password,
      });
      if (verifyPassword === false) {
        return null;
      }
      const token = await this.authService.generateJwtToken({
        id: user.id,
        email: user.email,
      });
      return token;
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
