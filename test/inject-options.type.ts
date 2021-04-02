import { NestFastifyApplication } from '@nestjs/platform-fastify';

export type InjectOptions = Extract<
  Parameters<NestFastifyApplication['inject']>[0],
  // eslint-disable-next-line @typescript-eslint/ban-types
  object
>;
