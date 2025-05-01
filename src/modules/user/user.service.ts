import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entity/user.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { JwtPayload } from '../../common/interfaces/jwtPayload.interface';
import { UpdateUser } from './dto/updateUser.dto';
import { UpdateEmail } from './dto/updateEmail.dto';

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
        role: user.role,
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
      signUpDto.password = newPassword;
      const createUser = await this.prisma.user.create({
        data: signUpDto,
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

  async findByJwt(jwtPayload: JwtPayload): Promise<true | false> {
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

  async updateUser(id: string, data: UpdateUser): Promise<UserEntity | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async updateEmail(updateEmail: UpdateEmail): Promise<string | false> {
    try {
      const userWithNewEmail = await this.prisma.user.update({
        where: { email: updateEmail.currentEmail },
        data: { email: updateEmail.email },
      });
      if (!userWithNewEmail) {
        return false;
      }
      return userWithNewEmail.email;
    } catch {
      return false;
    }
  }
}
