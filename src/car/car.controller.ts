import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/interfaces/requestWithUser.interface';
import { CreateCarDto } from './dto/createCar.dto';
import { CarService } from './car.service';
import { CarDto } from './dto/car.dto';
import { Public } from '../common/decorators/public.decorator';
import { FilterCarDto } from './dto/filterCar.dto';
import { FindSoldCarsDto } from './dto/findSoldCars.dto';
import { CarWithoutSellerIdDto } from './dto/carWithoutSellerId.dto.ts';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Roles('SELLER')
  @Post('create')
  async createCar(
    @Req() req: RequestWithUser,
    @Body() createCarDto: CreateCarDto,
  ): Promise<CarWithoutSellerIdDto> {
    const carEntity = await this.carService.createCar(
      req.user.id,
      createCarDto,
    );
    return carEntity;
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
    return cars.map((car) => new CarDto(car));
  }

  @Roles('SELLER')
  @Delete()
  async deleteCar(
    @Req() req: RequestWithUser,
    @Query() id: string,
  ): Promise<{ carDeletedSuccessfully: true }> {
    const compareUserIdWithSellerId =
      await this.carService.compareUserIdWithSellerId(req.user.id, id);
    if (compareUserIdWithSellerId === false) {
      throw new UnauthorizedException();
    }
    const deletedCar = await this.carService.deleteCar(id);
    if (!deletedCar) {
      throw new InternalServerErrorException();
    }
    return { carDeletedSuccessfully: true };
  }

  @Roles('SELLER')
  @Get('sold')
  async findSoldCars(
    @Req() req: RequestWithUser,
    @Query() findSoldCarsDto: FindSoldCarsDto,
  ) {
    const cars = await this.carService.findSoldCars(
      findSoldCarsDto.page,
      req.user.id,
    );
    if (!cars) {
      throw new InternalServerErrorException();
    }
    // this is just a test
    return cars.map((car) => new CarDto(car));
  }
}
