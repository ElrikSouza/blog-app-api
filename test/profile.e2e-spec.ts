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

describe('ProfileController (e2e)', () => {
  let app: NestFastifyApplication;
  let entityManager: EntityManager;

  const userAccounts = createMockUserAccounts(4);

  const profiles = [
    {
      id: 'e7ce7423-e750-4b6e-bf65-777adaed92fd',
      account_id: userAccounts[0].id,
      display_name: 'Example Joe',
      profile_name: 'ejoe',
      bio: 'Example',
    },
    {
      id: 'e73e7424-e750-4b6e-bf65-777adaed12fd',
      account_id: userAccounts[0].id,
      display_name: 'Example Joe II',
      profile_name: 'ejoe2',
      bio: 'ExampleII',
    },
    {
      id: 'e23e7424-e732-4b6e-bf32-777adaed12fd',
      account_id: userAccounts[1].id,
      display_name: 'Example Joe III',
      profile_name: 'ejoe3',
      bio: 'ExampleIII',
    },
    {
      id: 'e23e3333-e732-4b6e-bf32-777adaed12fd',
      account_id: userAccounts[1].id,
      display_name: 'Example Joe Del',
      profile_name: 'ejoe3333',
      bio: 'ExampleDelete',
    },
  ];

  beforeAll(async () => {
    const moduleFixture = await createModuleFixture([
      AuthModule,
      ProfileModule,
    ]);

    entityManager = moduleFixture.get<EntityManager>(EntityManager);

    await entityManager.query('delete from user_account;');
    await entityManager.insert(UserAccount, userAccounts);

    await entityManager.query('delete from user_profile;');
    await entityManager.insert(UserProfile, profiles);

    app = await createTestApp(moduleFixture);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/profiles/:id (DELETE)', () => {
    it.todo(
      'should delete the profile if the user is the owner of the profile',
    );

    it.todo('should return 404 if the profile does not exist');

    it.todo('should return 400 if the id is invalid');

    it.todo('should return 403 if the user is not the owner of the profile');

    it.todo('should return 401 if the user is not authenticated');
  });

  describe('/profiles (POST)', () => {
    it.todo('should return 409 if the user already has two profiles');

    it.todo('should succeed if the use has less than two profiles');

    it.todo('should return 409 if the requested username is already in use');

    it.todo('should return 401 if the user is not authenticated');
  });

  describe('/profiles/:id (GET)', () => {
    const getProfileRequest = (id: string): InjectOptions => ({
      url: `/profiles/${id}`,
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
