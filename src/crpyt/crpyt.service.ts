import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { envVars } from 'src/env';

@Injectable()
export class CrpytService {
  constructor(private rounds = envVars.BCRYPT_ROUNDS) {}

  public async hashAsync(data: unknown) {
    return hash(data, this.rounds);
  }

  public async compareAsync(data: unknown, hash: string) {
    return compare(data, hash);
  }
}
