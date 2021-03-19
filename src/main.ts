import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'fastify-helmet';
import { envVars } from './env';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(helmet);

  await app.listen(envVars.PORT);
}

bootstrap();
