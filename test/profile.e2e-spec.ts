import { AuthModule } from 'auth/auth.module';
import { EntityManager } from 'typeorm';
import { UserAccount } from 'user-account/user-account.entity';
import type { InjectOptions } from './inject-options.type';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { UserProfile } from 'profile/user-profile.entity';
import { createMockUserAccounts } from 'user-account/user-account.mock';
import { createModuleFixture, createTestApp } from './module-fixture';
import { ProfileModule } from 'profile/profile.module';
import * as faker from 'faker';
import { createOneMockProfile } from 'profile/profile.mock';
import { AuthService } from '../dist/auth/auth.service';

describe('ProfileController (e2e)', () => {
  let app: NestFastifyApplication;
  let entityManager: EntityManager;
  let authService: AuthService;
  let tokens: string[];

  const userAccounts = createMockUserAccounts(4);

  const profiles = [
    createOneMockProfile(userAccounts[0].id),
    createOneMockProfile(userAccounts[0].id),
    createOneMockProfile(userAccounts[1].id),
    createOneMockProfile(userAccounts[2].id),
  ];

  beforeAll(async () => {
    const moduleFixture = await createModuleFixture([
      AuthModule,
      ProfileModule,
    ]);

    entityManager = moduleFixture.get<EntityManager>(EntityManager);
    authService = moduleFixture.get<AuthService>(AuthService);

    await entityManager.query('delete from user_account;');
    await entityManager.insert(UserAccount, userAccounts);

    await entityManager.query('delete from user_profile;');
    await entityManager.insert(UserProfile, profiles);

    tokens = await Promise.all(
      [0, 1, 2].map(async (index) =>
        authService.logIn({
          email: userAccounts[index].email,
          password: '12345678',
        }),
      ),
    );

    tokens = tokens.map((token) => `Bearer ${token}`);

    app = await createTestApp(moduleFixture);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/profiles/:profile_name (DELETE)', () => {
    const generateDeleteProfileRequest = (id: string): InjectOptions => ({
      method: 'DELETE',
      url: `/profiles/${id}`,
    });

    it('should delete the profile if the user is the owner of the profile', async () => {
      const result = await app.inject({
        ...generateDeleteProfileRequest(profiles[3].profile_name),
        headers: { Authorization: tokens[2] },
      });

      expect(result.statusCode).toBe(200);
    });

    it('should return 404 if the profile does not exist', async () => {
      const { statusCode } = await app.inject({
        ...generateDeleteProfileRequest('a'.repeat(23)),
        headers: { Authorization: tokens[0] },
      });

      expect(statusCode).toBe(404);
    });

    it('should return 400 if the id is invalid', async () => {
      const { statusCode } = await app.inject({
        ...generateDeleteProfileRequest('a'.repeat(36)),
        headers: { Authorization: tokens[0] },
      });

      expect(statusCode).toBe(400);
    });

    it('should return 403 if the user is not the owner of the profile', async () => {
      const { statusCode } = await app.inject({
        ...generateDeleteProfileRequest(profiles[2].profile_name),
        headers: { Authorization: tokens[0] },
      });

      expect(statusCode).toBe(403);
    });

    it('should return 401 if the user is not authenticated', async () => {
      const { statusCode } = await app.inject({
        ...generateDeleteProfileRequest(profiles[1].profile_name),
      });

      expect(statusCode).toBe(401);
    });
  });

  describe('/profiles (POST)', () => {
    it.todo('should return 409 if the user already has two profiles');

    it.todo('should succeed if the use has less than two profiles');

    it.todo('should return 409 if the requested username is already in use');

    it.todo('should return 401 if the user is not authenticated');
  });

  describe('/profiles/:profile_name (GET)', () => {
    const getProfileRequest = (profileName: string): InjectOptions => ({
      url: `/profiles/${profileName}`,
      method: 'GET',
    });

    it('should return 404 if the requested profile does not exist', async () => {
      const result = await app.inject(
        getProfileRequest(faker.datatype.string(20)),
      );

      expect(result.statusCode).toBe(404);
    });

    it('should return the requested profile', async () => {
      const result = await app.inject(
        getProfileRequest(profiles[0].profile_name),
      );

      expect(JSON.parse(result.body)).toStrictEqual(profiles[0]);
    });
  });
});
