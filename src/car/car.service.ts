import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/createCar.dto';
import { CarEntity } from './entity/car.entity';
import { FilterCarDto } from './dto/filterCar.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CarService {
  constructor(private prisma: PrismaService) {}

  async createCar(
    sellerId: string,
    createCarDto: CreateCarDto,
  ): Promise<CarEntity | null> {
    try {
      const car = await this.prisma.car.create({
        data: {
          seller_id: sellerId,
          color: createCarDto.color,
          description: createCarDto.description,
          model: createCarDto.model,
          name: createCarDto.name,
          year: createCarDto.year,
          price: createCarDto.price.toFixed(2),
        },
      });
      if (!car) {
        return null;
      }
      return car;
    } catch {
      return null;
    }
  }

  async findCarsByFilter(
    filterCarDto: FilterCarDto,
  ): Promise<CarEntity[] | null> {
    const pageSize = 20;
    const take = pageSize;
    const skip = (filterCarDto.page - 1) * pageSize;

    try {
      const where: Prisma.CarWhereInput = {
        ...(typeof filterCarDto.color === 'string' &&
          filterCarDto.color.trim() !== '' && {
            color: {
              contains: filterCarDto.color,
              mode: 'insensitive',
            },
          }),
        ...(typeof filterCarDto.model === 'string' &&
          filterCarDto.model.trim() !== '' && {
            model: {
              contains: filterCarDto.model,
              mode: 'insensitive',
            },
          }),
        ...(typeof filterCarDto.name === 'string' &&
          filterCarDto.name.trim() !== '' && {
            name: {
              contains: filterCarDto.name,
              mode: 'insensitive',
            },
          }),
        price: {
          ...(filterCarDto.minPrice !== undefined && {
            gte: filterCarDto.minPrice,
          }),
          ...(filterCarDto.maxPrice !== undefined && {
            lte: filterCarDto.maxPrice,
          }),
        },
        year: {
          ...(filterCarDto.minYear !== undefined && {
            gte: filterCarDto.minYear,
          }),
          ...(filterCarDto.maxYear !== undefined && {
            lte: filterCarDto.maxYear,
          }),
        },
        stock: { gt: 0 },
      };
      const findCar: CarEntity[] = await this.prisma.car.findMany({
        skip,
        take,
        where,
        orderBy: { name: 'asc' },
      });
      return findCar;
    } catch {
      return null;
    }
  }
  async findSoldCars(
    page: number,
    seller_id: string,
  ): Promise<CarEntity[] | null> {
    const pageSize = 20;
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    try {
      return await this.prisma.car.findMany({
        skip,
        take,
        where: {
          seller_id,
          stock: { equals: 0 },
        },
        orderBy: { name: 'asc' },
      });
    } catch {
      return null;
    }
  }

  async deleteCar(carId: string): Promise<boolean> {
    try {
      const deletedCar = await this.prisma.car.delete({
        where: { id: carId },
      });
      if (!deletedCar) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  async compareUserIdWithSellerId(
    userId: string,
    carId: string,
  ): Promise<boolean> {
    try {
      const car = await this.prisma.car.findUnique({
        where: { id: carId },
      });
      if (!car || car.seller_id !== userId) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}
