import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'fastify-helmet';
import compress from 'fastify-compress';
import cookie from 'fastify-cookie';
import { envVars } from './env';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { types } from 'pg';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Postgres Driver: Use integers instead of strings
  types.setTypeParser(20, Number.parseInt);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.register(helmet);
  app.register(cookie, { secret: envVars.COOKIE_SECRET });
  app.register(compress, { encodings: ['gzip', 'deflate'] });

  await app.listen(envVars.PORT);
}

bootstrap();
