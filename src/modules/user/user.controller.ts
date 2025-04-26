import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../../common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserEntity } from './entity/user.entity';

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
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return new UserEntity(user);
  }
}
