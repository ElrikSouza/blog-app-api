import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { getJwtFromCookiesOrAuthHeader } from './extract-jwt';
import { envVars } from 'env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: getJwtFromCookiesOrAuthHeader,
      ignoreExpiration: false,
      secretOrKey: envVars.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userAccountId: payload.userAccountId };
  }
}
