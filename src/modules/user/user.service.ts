import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entity/user.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';

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
        password: loginDto.password,
        hash: user.password,
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

  async signUp(signUpDto: SignUpDto): Promise<UserEntity | null> {
    try {
      const newPassword = await this.authService.hashPassword(
        signUpDto.password,
      );
      const createUser = await this.prisma.user.create({
        data: {
          firstName: signUpDto.firstName,
          lastName: signUpDto.lastName,
          email: signUpDto.email,
          cpf: signUpDto.cpf,
          password: newPassword,
        },
      });
      return createUser;
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch {
      return null;
    }
  }
}
