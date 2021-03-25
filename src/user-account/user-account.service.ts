import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './user-account.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccount)
    private userAccountRepo: Repository<UserAccount>,
  ) {}

  public async isEmailAlreadyTaken(email: string) {
    const count = await this.userAccountRepo.count({ email });

    return count >= 1;
  }

  async getUserAccountOrFail(email: string) {
    const userAccount = await this.userAccountRepo.findOne({ email });

    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }

    return userAccount;
  }

  /**
  This method does not modify the data inputed. Changes such as 
  password hashing must be made before using this method.

  Since the id field will be generated, it is not required.
  **/
  public async addUserAccount(userAccount: Omit<UserAccount, 'id'>) {
    await this.userAccountRepo.insert({ ...userAccount, id: uuid() });
  }
}
