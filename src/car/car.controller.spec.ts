import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { UserService } from '../user/user.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateCarDto } from './dto/createCar.dto';
import { RequestWithUser } from '../common/interfaces/requestWithUser.interface';
import { UserEntity } from '../user/entity/user.entity';
import { UserDto } from '../user/dto/user.dto';
import { CarWithoutSellerIdDto } from './dto/carWithoutSellerId.dto.ts';
import { CarEntity } from './entity/car.entity';

describe('CarController', () => {
  let controller: CarController;
  let carService: jest.Mocked<CarService>;
  let userService: jest.Mocked<UserService>;

  const mockReq = {
    user: { id: '1' },
  } as Partial<RequestWithUser> as RequestWithUser;

  const createCarDtoFactory = (
    overrides?: Partial<CreateCarDto>,
  ): CreateCarDto => ({
    name: 'golf',
    color: 'azul',
    description: 'bla bla',
    model: 'chevrolet',
    price: new Decimal(1234.95),
    year: 2010,
    ...overrides,
  });

  const carWithoutSellerIdFactory = (
    overrides?: Partial<CarWithoutSellerIdDto>,
  ): CarWithoutSellerIdDto => ({
    id: '1',
    stock: 1,
    ...createCarDtoFactory(),
    ...overrides,
  });

  const carFactory = (overrides?: Partial<CarEntity>): CarEntity => ({
    id: '1',
    stock: 1,
    seller_id: '1',
    ...createCarDtoFactory(),
    ...overrides,
  });

  const userEntityFactory = (overrides?: Partial<UserEntity>): UserDto => ({
    id: '1',
    role: 'SELLER',
    secret_otp: null,
    password: '123456',
    first_name: 'Alberto',
    last_name: 'Oliveira Cardoso',
    email: 'example@gmail.com',
    cpf: '111.111.111-22',
    cnpj: null,
    city: 'São Paulo',
    complement: 'xxxxxxx',
    country: 'Brasil',
    neighborhood: 'São Pedro',
    number_address: 'S/N',
    state: 'São Paulo',
    street: 'Av. Airton Senna',
    zip_code: '75674-890',
    phone: '(64) 99999-9999',
    created_at: new Date(Date.now()),
    update_at: new Date(Date.now()),
    ...overrides,
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: {
            createCar: jest.fn(),
            findCarsByFilter: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    carService = module.get(CarService);
    userService = module.get(UserService);
  });

  describe('createCar', () => {
    it('should show UnauthorizedException if the user do not exist', async () => {
      userService.findById.mockResolvedValue(null);
      return expect(
        controller.createCar(mockReq, createCarDtoFactory()),
      ).resolves.toEqual(undefined);
    });

    it('should return a car entity without seller_id', async () => {
      userService.findById.mockResolvedValue(userEntityFactory());
      carService.createCar.mockResolvedValue(carWithoutSellerIdFactory());
      return expect(
        controller.createCar(mockReq, createCarDtoFactory()),
      ).resolves.toEqual(carWithoutSellerIdFactory());
    });
  });

  describe('findByFilter', () => {
    it('should return a car of a filter', async () => {
      carService.findCarsByFilter.mockResolvedValue([
        carFactory({ model: 'bmw' }),
      ]);
      return expect(
        controller.findCarsByFilter({ model: 'bmw', page: 1 }),
      ).resolves.toEqual([carFactory({ model: 'bmw' })]);
    });
  });
});
