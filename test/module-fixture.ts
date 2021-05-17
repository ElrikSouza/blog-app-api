import { ModuleMetadata, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookies from 'fastify-cookie';

const databaseStringAccidentCheck = () => {
  if (process.env.DATABASE_STRING == process.env.DATABASE_STRING_TEST) {
    console.error(
      'The test database is the same as the main database. This might be a mistake.',
    );
    process.exit(1);
  }
};

export const createModuleFixture = async (
  modules: ModuleMetadata['imports'],
) => {
  databaseStringAccidentCheck();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ...modules,
      TypeOrmModule.forRoot({
        type: 'postgres',
        url: process.env.DATABASE_STRING_TEST,
        autoLoadEntities: true,
      }),
    ],
  }).compile();

  return moduleFixture;
};

export const createTestApp = async (moduleFixture: TestingModule) => {
  const app = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.register(cookies, { secret: 'test' });

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
};
