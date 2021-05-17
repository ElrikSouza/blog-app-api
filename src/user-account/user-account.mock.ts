import { v4 as uuid } from 'uuid';
import { hashSync } from 'bcrypt';
import * as faker from 'faker';

export const mockUserAccounts = [
  {
    id: uuid(),
    email: 'email1@example.com',
    password: hashSync('12345678', 1),
  },
  {
    id: uuid(),
    email: 'email2@example.com',
    password: hashSync('12345678', 1),
  },
];
const hashed1to8 = hashSync('12345678', 1);

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

export const mockUserAccountRepo = {
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
};
