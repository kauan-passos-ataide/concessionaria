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
