import { UserAccount } from './user-account.entity';
import * as faker from 'faker';

const hashed1to8 =
  '$2b$04$HbeWFucFsOc74oVAOivMle660bw3j1yo.JfXeE8LV3a.4atz1iERq';

const createOneMockUserAccount = (password = hashed1to8) => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  password,
});

export const createMockUserAccounts = (amount: number) => {
  if (amount <= 0) {
    throw new Error('Amount of generated accounts <= 0');
  }

  const mockUsers = [createOneMockUserAccount()];

  for (let i = 1; i < amount; i++) {
    mockUsers.push(createOneMockUserAccount());
  }

  return mockUsers;
};

export const mockUserAccountRepo = (mockUserAccounts: Array<UserAccount>) => ({
  async count({ email }: { email: string }) {
    const count = mockUserAccounts.filter((account) => account.email === email)
      .length;

    return count;
  },
  async findOne({ email }: { email: string }) {
    const result = mockUserAccounts.find((account) => account.email === email);

    return result;
  },
  async insert() {
    return;
  },
});
