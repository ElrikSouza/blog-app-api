import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'fastify-helmet';
import compress from 'fastify-compress';
import cookie from 'fastify-cookie';
import { envVars, validateEnvVars } from './env';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { types } from 'pg';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';

async function bootstrap() {
  validateEnvVars(envVars);

  const httpsOptions = {
    key: readFileSync('./secrets/server-key.pem'),
    cert: readFileSync('./secrets/server.pem'),
  };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ https: httpsOptions }),
    { cors: { origin: envVars.CORS_ORIGIN, credentials: true } },
  );

  // Postgres Driver: Use integers instead of strings
  types.setTypeParser(20, Number.parseInt);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.register(helmet);
  app.register(cookie, { secret: envVars.COOKIE_SECRET });
  app.register(compress, { encodings: ['gzip', 'deflate'] });

  await app.listen(envVars.PORT, envVars.HOST);
}

bootstrap();
