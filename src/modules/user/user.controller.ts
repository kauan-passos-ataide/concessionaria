import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../../common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserEntity } from './entity/user.entity';
import { RequestWithUser } from '../../common/interfaces/requestWithUser.interface';
import { UpdateUser } from './dto/updateUser.dto';
import { UpdateEmail } from './dto/updateEmail.dto';
import { UpdatePassword } from './dto/updatePassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<string> {
    const token = await this.userService.login(loginDto);
    if (token === null) {
      throw new HttpException(
        'Email or password incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
    throw new HttpException(token, HttpStatus.CREATED);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserEntity> {
    const verifyEmail = await this.userService.findByEmail(signUpDto.email);
    if (verifyEmail !== null) {
      throw new HttpException('Email already exist', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.signUp(signUpDto);
    if (user === null) {
      throw new InternalServerErrorException();
    }
    return new UserEntity(user);
  }

  @Patch('update')
  async updateUser(
    @Req() req: RequestWithUser,
    @Body() updateUser: UpdateUser,
  ): Promise<UserEntity> {
    const jwtPayload = req.user;
    const newUser = await this.userService.updateUser(
      jwtPayload.id,
      updateUser,
    );
    if (!newUser) {
      throw new InternalServerErrorException();
    }
    return new UserEntity(newUser);
  }

  @Patch('update-email')
  async updateEmail(
    @Req() req: RequestWithUser,
    @Body() updateEmail: UpdateEmail,
  ): Promise<{ newEmail: string }> {
    if (req.user.email !== updateEmail.currentEmail) {
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
}
