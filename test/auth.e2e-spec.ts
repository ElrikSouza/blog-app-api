import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from 'auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookies from 'fastify-cookie';
import { ValidationPipe } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserAccount } from 'user-account/user-account.entity';
import type { InjectOptions } from './inject-options.type';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;
  let entityManager: EntityManager;

  const userAccounts = [
    {
      id: 'e7ce7423-e750-4b6e-bf65-616adaed92fd',
      email: 'example@example.com',
      //12345678
      password: '$2b$04$7Ws/g16YVokTY5B7lC4kMONKzXyWmpWvm2ppA6sjuA7RUQxvTLTcK',
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_STRING_TEST,
          autoLoadEntities: true,
        }),
      ],
    }).compile();

    entityManager = moduleFixture.get<EntityManager>(EntityManager);

    await entityManager.query('delete from user_account;');
    await entityManager.insert(UserAccount, userAccounts);

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.register(cookies, { secret: 'test' });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    const loginPost: InjectOptions = { method: 'POST', url: '/auth/login' };

    it('should succeed if the credentials are correct', async () => {
      const result = await app.inject({
        ...loginPost,
        payload: { email: 'example@example.com', password: '12345678' },
      });

      expect(JSON.parse(result.body)).toHaveProperty('accessToken');
      expect(result.cookies.length).toBe(2);
      expect(result.statusCode).toBe(200);
    });

    it('should return 400 if the provided data is invalid', async () => {
      const result = await app.inject({
        ...loginPost,
        payload: { email: 'example', password: '1' },
      });

      expect(result.statusCode).toBe(400);
    });

    it('should return 401 if the password is wrong', async () => {
      const result = await app.inject({
        ...loginPost,
        payload: { email: 'example@example.com', password: 'wrongpassword' },
      });

      expect(result.statusCode).toBe(401);
    });

    it('should return 404 if the requested account does not exist', async () => {
      const result = await app.inject({
        ...loginPost,
        payload: { email: 'notfound@example.com', password: '12345678' },
      });

      expect(result.statusCode).toBe(404);
    });
  });

  describe('/auth/sign-up (POST)', () => {
    const signUpPost: InjectOptions = { method: 'POST', url: '/auth/sign-up' };

    it('should return 409 if the provided email is already taken', async () => {
      const result = await app.inject({
        ...signUpPost,
        payload: { email: 'example@example.com', password: '12345678' },
      });

      expect(result.statusCode).toBe(409);
    });

    it('should return 400 if the provided data is invalid', async () => {
      const result = await app.inject({
        ...signUpPost,
        payload: { email: 'aa', password: 'aa' },
      });

      expect(result.statusCode).toBe(400);
    });

    it('should succeed if the email is available and the provided data is valid', async () => {
      const result = await app.inject({
        ...signUpPost,
        payload: { email: 'aaa@email.com', password: 'aaaaaaaaaaa' },
      });

      expect(result.statusCode).toBe(201);
    });
  });
});
