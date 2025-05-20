import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/interfaces/requestWithUser.interface';
import { CreateCarDto } from './dto/createCar.dto';
import { CarService } from './car.service';
import { CarDto } from './dto/car.dto';
import { Public } from '../../common/decorators/public.decorator';
import { FilterCarDto } from './dto/filterCar.dto';

@Controller('car')
export class CarController {
  constructor(
    private readonly userService: UserService,
    private readonly carService: CarService,
  ) {}

  @Roles('SELLER')
  @Post()
  async createCar(
    @Req() req: RequestWithUser,
    @Body() createCarDto: CreateCarDto,
  ): Promise<CarDto> {
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const carEntity = await this.carService.createCar(user.id, createCarDto);
    if (!carEntity) {
      throw new InternalServerErrorException();
    }
    return new CarDto(carEntity);
  }

  @Public()
  @Get('filter')
  async findCarsByFilter(
    @Query()
    filterCarDto: FilterCarDto,
  ): Promise<CarDto[]> {
    const cars = await this.carService.findCarsByFilter(filterCarDto);
    if (!cars) {
      throw new InternalServerErrorException();
    }
    const carDto = cars.map((car) => new CarDto(car));
    return carDto;
  }
}
