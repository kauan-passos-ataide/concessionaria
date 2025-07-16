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
  ): Promise<{ success: true }> {
    const tokens = await this.userService.verifyOtpCode({
      email,
      password,
      code,
    });
    if (!tokens) {
      throw new UnauthorizedException();
    }
    res.cookie('cu_refresh', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
    });

    res.cookie('cu_jwt', tokens.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
    });
    return { success: true };
  }

  @Public()
  @Post('refresh')
  async generateNewAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: true }> {
    const refreshToken = req.cookies['cu_refresh'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload =
      await this.authService.getPayloadFromRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException();
    }

    const newAccessToken = await this.authService.generateJwtAccessToken({
      email: payload.email,
      id: payload.id,
      role: payload.role,
    });

    res.cookie('cu_jwt', newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
    });
    return { success: true };
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

  @Get('verify-role')
  async verifyRole(@Req() req: RequestWithUser) {
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { role: user.role };
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('cu_jwt', '', {
      httpOnly: true,
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
      path: '/',
    });
    res.cookie('cu_refresh', '', {
      httpOnly: true,
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
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
      sameSite: 'lax',
    });
    return { newAccessToken: tokenNewRole };
  }
}
