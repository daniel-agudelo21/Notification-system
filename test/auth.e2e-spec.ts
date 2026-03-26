import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth integration tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Daniel',
        email: 'daniel@test.com',
        password: '12345678',
      })
      .expect(201);

    expect(response.body.email).toBe('daniel@test.com');
    expect(response.body).toHaveProperty('id');

    const userInDb = await prisma.user.findUnique({
      where: { email: 'daniel@test.com' },
    });

    expect(userInDb).toBeTruthy();
    expect(userInDb?.password).not.toBe('12345678');
  });

  it('should login and return access token', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Daniel',
        email: 'daniel@test.com',
        password: '12345678',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'daniel@test.com',
        password: '12345678',
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('should fail login with invalid password', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Daniel',
      email: 'daniel@test.com',
      password: '12345678',
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'daniel@test.com',
        password: 'wrong-password',
      })
      .expect(401);
  });
});
