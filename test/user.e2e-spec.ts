import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SignUpDto } from './../src/user/dto/signup.dto';
import { App } from 'supertest/types';

describe('Users E2E', () => {
  let app: INestApplication<App>;

  const userEntityFactory = (overrides?: Partial<SignUpDto>): SignUpDto => ({
    password: '123456',
    first_name: 'Alberto',
    last_name: 'Passos Ataide',
    email: 'kauanpassosataide321@gmail.com',
    cpf: '712.021.791-77',
    cnpj: null,
    city: 'Mineiros',
    complement: 'Q.05 L.16',
    country: 'Brasil',
    neighborhood: 'São Pedro',
    number_address: 'S/N',
    state: 'Goiás',
    street: 'Av. Filinho Vilela',
    zip_code: '75831-258',
    phone: '(64) 99932-7259',
    ...overrides,
  });

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/user/sign-up')
      .send(userEntityFactory())
      .expect(201);

    expect(response.body).toHaveProperty('srcQrCode');
  });
});
