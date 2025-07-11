import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { RequestWithUser } from '../common/interfaces/requestWithUser.interface';
import { UpdateUser } from './dto/updateUser.dto';
import { UpdateEmail } from './dto/updateEmail.dto';
import { UpdatePassword } from './dto/updatePassword.dto';
import { UserDto } from './dto/user.dto';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { OtpCodeDto } from './dto/otpCode.dto';
import { AuthService } from '../auth/auth.service';

dotenv.config();

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() { email, password }: LoginDto,
  ): Promise<{ userChecked: boolean }> {
    const user = await this.userService.login({ email, password });
    if (!user) {
      throw new HttpException(
        'Email or password incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { userChecked: true };
  }

  @Public()
  @Post('2fa-auth')
  async verifyOtpCode(
    @Body() { email, password, code }: OtpCodeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const token = await this.userService.verifyOtpCode({
      email,
      password,
      code,
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
    });
    return { accessToken: token };
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ srcQrCode: string }> {
    const verifyEmail = await this.userService.findByEmail(signUpDto.email);
    if (verifyEmail) {
      throw new HttpException('Email already exist', HttpStatus.UNAUTHORIZED);
    }
    const srcQrCode = await this.userService.signUp(signUpDto);
    if (!srcQrCode) {
      throw new InternalServerErrorException();
    }
    return { srcQrCode };
  }

  @Public() //alterar
  @Get('verify-role')
  async verifyRole(@Req() req: Request) {
    const token = req.cookies['token'] as string;
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.authService.getPayload(token);
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { role: user.role };
  }

  @Public() //alterar
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
      path: '/',
    });
  }

  @Patch('update')
  async updateUser(
    @Req() req: RequestWithUser,
    @Body() updateUser: UpdateUser,
  ): Promise<UserDto> {
    const jwtPayload = req.user;
    const newUser = await this.userService.updateUser(
      jwtPayload.id,
      updateUser,
    );
    if (!newUser) {
      throw new InternalServerErrorException();
    }
    return new UserDto(newUser);
  }

  @Patch('update-email')
  async updateEmail(
    @Req() req: RequestWithUser,
    @Body() updateEmail: UpdateEmail,
  ): Promise<{ newEmail: string }> {
    if (req.user.email !== updateEmail.current_email) {
      throw new UnauthorizedException();
    }
    const newEmail = await this.userService.updateEmail(updateEmail);
    if (!newEmail) {
      throw new InternalServerErrorException();
    }
    return { newEmail };
  }

  @Patch('update-password')
  async updatePassword(
    @Req() req: RequestWithUser,
    @Body() updatePassword: UpdatePassword,
  ): Promise<{ updatePassword: boolean }> {
    const user = await this.userService.findByEmail(req.user.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const comparePassword = await this.userService.comparePassword(
      user,
      updatePassword,
    );
    if (!comparePassword) {
      throw new UnauthorizedException();
    }
    const password = await this.userService.updatePassword(
      req.user.id,
      updatePassword,
    );
    if (!password) {
      throw new InternalServerErrorException();
    }
    return { updatePassword: true };
  }

  @Patch('new-seller')
  async newSeller(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ newAccessToken: string }> {
    const verify = await this.userService.findById(req.user.id);
    if (!verify) {
      throw new UnauthorizedException();
    }
    const tokenNewRole = await this.userService.newSeller(req.user.id);
    if (!tokenNewRole) {
      throw new InternalServerErrorException();
    }
    res.cookie('token', tokenNewRole, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
    });
    return { newAccessToken: tokenNewRole };
  }
}
