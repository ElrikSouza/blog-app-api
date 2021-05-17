import { AuthModule } from 'auth/auth.module';
import { EntityManager } from 'typeorm';
import { UserAccount } from 'user-account/user-account.entity';
import type { InjectOptions } from './inject-options.type';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createModuleFixture, createTestApp } from './module-fixture';
import * as faker from 'faker';
import { createMockUserAccounts } from 'user-account/user-account.mock';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;
  let entityManager: EntityManager;

  const userAccounts = createMockUserAccounts(1);
  const correctPassword = '12345678';

  beforeAll(async () => {
    const moduleFixture = await createModuleFixture([AuthModule]);

    entityManager = moduleFixture.get<EntityManager>(EntityManager);

    await entityManager.query('delete from user_account;');
    await entityManager.insert(UserAccount, userAccounts);

    app = await createTestApp(moduleFixture);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    const loginPost: InjectOptions = { method: 'POST', url: '/auth/login' };

    it('should succeed if the credentials are correct', async () => {
      const result = await app.inject({
        ...loginPost,
        payload: { email: userAccounts[0].email, password: correctPassword },
      });

      expect(JSON.parse(result.body)).toHaveProperty('accessToken');
      expect(result.cookies.length).toBe(2);
      expect(result.statusCode).toBe(200);
    });

    it('should return 400 if the provided data is invalid', async () => {
      const result = await app.inject({
        ...loginPost,
        payload: {
          email: faker.datatype.string(1),
          password: faker.datatype.string(4),
        },
      });

      expect(result.statusCode).toBe(400);
    });

    it('should return 401 if the password is wrong', async () => {
      const result = await app.inject({
        ...loginPost,
        payload: {
          email: userAccounts[0].email,
          password: faker.datatype.string(9),
        },
      });

      expect(result.statusCode).toBe(401);
    });

    it('should return 401 if the requested account does not exist', async () => {
      const result = await app.inject({
        ...loginPost,
        payload: {
          email: faker.internet.email(),
          password: faker.datatype.string(8),
        },
      });

      expect(result.statusCode).toBe(401);
    });
  });

  describe('/auth/sign-up (POST)', () => {
    const signUpPost: InjectOptions = { method: 'POST', url: '/auth/sign-up' };

    it('should return 400 if the provided email is already taken', async () => {
      const result = await app.inject({
        ...signUpPost,
        payload: {
          email: userAccounts[0].email,
          password: faker.datatype.string(8),
        },
      });

      expect(result.statusCode).toBe(400);
    });

    it('should return 400 if the provided data is invalid', async () => {
      const result = await app.inject({
        ...signUpPost,
        payload: {
          email: faker.datatype.string(2),
          password: faker.datatype.string(2),
        },
      });

      expect(result.statusCode).toBe(400);
    });

    it('should succeed if the email is available and the provided data is valid', async () => {
      const result = await app.inject({
        ...signUpPost,
        payload: {
          email: faker.internet.email(),
          password: faker.datatype.string(9),
        },
      });

      expect(result.statusCode).toBe(201);
    });
  });
});
