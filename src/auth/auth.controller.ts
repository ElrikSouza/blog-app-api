import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { CookieSerializeOptions } from 'fastify-cookie';
import { envVars } from 'env';

const cookieOptions: CookieSerializeOptions = {
  maxAge: 172800,
  sameSite: true,
  signed: true,
  secure: true,
  domain: envVars.COOKIE_DOMAIN,
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  public async logIn(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() userInfo: AuthDTO,
  ) {
    const accessToken = await this.authService.logIn(userInfo);

    return response
      .setCookie('Authorization', accessToken, {
        ...cookieOptions,
        httpOnly: true,
      })
      .setCookie('isLoggedIn', 'true', cookieOptions)
      .status(200)
      .send({ accessToken });
  }

  @Post('sign-up')
  public async signUp(@Body() userInfo: AuthDTO) {
    await this.authService.signUp(userInfo);

    return { message: 'User account has been created' };
  }
}
