import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Notifications integration tests', () => {
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

  async function registerAndLoginUser() {
    const email = `daniel@test.com`;
    const password = 'password123';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Daniel',
        email,
        password,
      });

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      });

    expect(loginResponse.status).toBe(201);
    expect(loginResponse.body.accessToken).toBeDefined();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Test setup failed: user was not created');
    }

    return {
      accessToken: loginResponse.body.accessToken as string,
      userId: user.id,
      email,
    };
  }

  it('should reject get notifications without token', async () => {
    await request(app.getHttpServer()).get('/notifications').expect(401);
  });

  it('should create an EMAIL notification', async () => {
    const { accessToken } = await registerAndLoginUser();

    const response = await request(app.getHttpServer())
      .post('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Welcome',
        content: 'Welcome email',
        channel: 'EMAIL',
      })
      .expect(201);

    expect(response.body.title).toBe('Welcome');
    expect(response.body.channel).toBe('EMAIL');

    const notificationInDb = await prisma.notification.findUnique({
      where: { id: response.body.id },
    });

    expect(notificationInDb).toBeTruthy();
    expect(notificationInDb?.status).toBe('SENT');
    expect(notificationInDb?.metadata).toBeTruthy();
  });

  it('should fail creating an invalid SMS notification', async () => {
    const { accessToken, userId } = await registerAndLoginUser();

    const response = await request(app.getHttpServer())
      .post('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Long SMS',
        content: 'a'.repeat(161),
        channel: 'SMS',
      })
      .expect(400);

    expect(response.body.message).toContain('160');

    const notifications = await prisma.notification.findMany({
      where: { userId },
    });

    expect(notifications).toHaveLength(0);
  });

  it('should list only user notifications', async () => {
    const { accessToken } = await registerAndLoginUser();

    await request(app.getHttpServer())
      .post('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Push Test',
        content: 'Push body',
        channel: 'PUSH',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Push Test');
  });
});
