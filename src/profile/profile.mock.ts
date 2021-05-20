import { UserProfile } from './user-profile.entity';
import * as faker from 'faker';

export const createOneMockProfile = (account_id: string): UserProfile => ({
  id: faker.datatype.uuid(),
  profile_name: faker.internet.userName(),
  display_name: faker.internet.userName(),
  bio: faker.lorem.word(4),
  account_id,
});
