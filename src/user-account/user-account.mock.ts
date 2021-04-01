import { v4 as uuid } from 'uuid';
import { hashSync } from 'bcrypt';

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
