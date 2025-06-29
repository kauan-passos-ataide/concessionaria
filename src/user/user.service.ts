import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { UpdateUser } from './dto/updateUser.dto';
import { UpdateEmail } from './dto/updateEmail.dto';
import { UpdatePassword } from './dto/updatePassword.dto';
import { UserDto } from './dto/user.dto';
import { OtpCodeDto } from './dto/otpCode.dto';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto): Promise<boolean> {
    try {
      const user = await this.verifyEmailAndComparePassword(loginDto);
      if (!user) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  async verifyOtpCode({
    code,
    email,
    password,
  }: OtpCodeDto): Promise<string | false> {
    try {
      const user = await this.verifyEmailAndComparePassword({
        email,
        password,
      });
      if (!user) {
        return false;
      }
      const isValid = authenticator.verify({
        token: code,
        secret: user.secret_otp as string,
      });
      if (!isValid) {
        return false;
      }
      const token = await this.authService.generateJwtToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      return token;
    } catch {
      return false;
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<string | null> {
    try {
      const newPassword = await this.authService.hashPassword(
        signUpDto.password,
      );
      signUpDto.password = newPassword;
      const user = await this.prisma.$transaction(async (tx) => {
        const createUser = await tx.user.create({
          data: signUpDto,
        });
        const secret = authenticator.generateSecret();
        return await tx.user.update({
          where: { id: createUser.id },
          data: { secret_otp: secret },
        });
      });
      const otpAuth = authenticator.keyuri(
        user.email,
        'KPA Systems',
        user.secret_otp as string,
      );
      return await QRCode.toDataURL(otpAuth);
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

  async newSeller(id: string): Promise<string | null> {
    try {
      const updateUser = await this.prisma.user.update({
        where: { id },
        data: { role: 'SELLER' },
      });
      const newAccessToken = await this.authService.generateJwtToken({
        id: updateUser.id,
        email: updateUser.email,
        role: updateUser.role,
      });
      if (!newAccessToken) {
        return null;
      }
      return newAccessToken;
    } catch {
      return null;
    }
  }

  async verifyEmailAndComparePassword({
    email,
    password,
  }: LoginDto): Promise<UserDto | false> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        return false;
      }
      const verifyPassword = await this.authService.comparePassword({
        password,
        hash: user.password,
      });
      if (verifyPassword === false) {
        return false;
      }
      return user;
    } catch {
      return false;
    }
  }
}
