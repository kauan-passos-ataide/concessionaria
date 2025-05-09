import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/interfaces/requestWithUser.interface';
import { CreateCarDto } from './dto/createCar.dto';
import { CarService } from './car.service';
import { CarDto } from './dto/car.dto';

@Roles('SELLER')
@Controller('car')
export class CarController {
  constructor(
    private readonly userService: UserService,
    private readonly carService: CarService,
  ) {}

  @Post()
  async createCar(
    @Req() req: RequestWithUser,
    @Body() createCarDto: CreateCarDto,
  ): Promise<CarDto> {
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const car = await this.carService.createCar(user.id, createCarDto);
    if (!car) {
      throw new InternalServerErrorException();
    }
    return new CarDto(car);
  }
}
