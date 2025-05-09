import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUser } from './dto/updateUser.dto';
import { UpdateEmail } from './dto/updateEmail.dto';
import { UpdatePassword } from './dto/updatePassword.dto';
import { UserDto } from './dto/user.dto';

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

  async signUp(signUpDto: SignUpDto): Promise<UserDto | null> {
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

  async findByEmail(email: string): Promise<UserDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch {
      return null;
    }
  }

  async findById(id: string): Promise<UserDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch {
      return null;
    }
  }

  async updateUser(id: string, data: UpdateUser): Promise<UserDto | null> {
    try {
      const updateUser = await this.prisma.user.update({
        where: { id },
        data,
      });
      return updateUser;
    } catch {
      return null;
    }
  }

  async updateEmail(updateEmail: UpdateEmail): Promise<string | false> {
    try {
      const userWithNewEmail = await this.prisma.user.update({
        where: { email: updateEmail.current_email },
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

  async updatePassword(
    id: string,
    updatePassword: UpdatePassword,
  ): Promise<boolean> {
    try {
      const hashPassword = await this.authService.hashPassword(
        updatePassword.password,
      );
      const userWithNewEmail = await this.prisma.user.update({
        where: { id },
        data: { password: hashPassword },
      });
      if (!userWithNewEmail) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  async comparePassword(
    user: UserDto,
    updatePassword: UpdatePassword,
  ): Promise<boolean> {
    try {
      const verifyPassword = await this.authService.comparePassword({
        password: updatePassword.current_password,
        hash: user.password,
      });
      if (!verifyPassword) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  async newSeller(id: string): Promise<UserDto | null> {
    try {
      const updateUser = await this.prisma.user.update({
        where: { id },
        data: { role: 'SELLER' },
      });
      return updateUser;
    } catch {
      return null;
    }
  }
}
