import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarDto } from './dto/createCar.dto';
import { CarEntity } from './entity/car.entity';

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
}
