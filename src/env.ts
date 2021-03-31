import { config } from 'dotenv';

config();

export interface Env {
  PORT: number;
  HOST?: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  CORS_ORIGIN: string;
  COOKIE_DOMAIN: string;
  DATABASE_STRING: string;
  REDIS_STRING: string;
  BCRYPT_ROUNDS: number;
}

const PORT = Number.parseInt(process.env.PORT ?? '4000');
const BCRYPT_ROUNDS = Number.parseInt(process.env.BCRYPT_ROUNDS ?? '12');
const {
  JWT_SECRET,
  COOKIE_SECRET,
  COOKIE_DOMAIN,
  CORS_ORIGIN,
  DATABASE_STRING,
  REDIS_STRING,
  HOST,
} = process.env;

export const validateEnvVars = (envVars: Env) => {
  if (Number.isNaN(envVars.PORT) || envVars.PORT < 2) {
    console.error('Invalid PORT');
    process.exit(1);
  } else if (Number.isNaN(envVars.BCRYPT_ROUNDS) || envVars.BCRYPT_ROUNDS < 1) {
    console.error('Invalid BCRYPT_ROUNDS');
    process.exit(1);
  } else if (JWT_SECRET == null) {
    console.error('JWT_SECRET was not defined');
    process.exit(1);
  } else if (COOKIE_SECRET == null) {
    console.error('COOKIE_SECRET was not defined');
    process.exit(1);
  } else if (COOKIE_DOMAIN == null) {
    console.error('COOKIE_DOMAIN was not defined');
    process.exit(1);
  } else if (CORS_ORIGIN == null) {
    console.error('CORS_ORIGIN was not defined');
    process.exit(1);
  } else if (DATABASE_STRING == null) {
    console.error('DATABASE_STRING was not defined');
    process.exit(1);
  } else if (REDIS_STRING == null) {
    console.error('REDIS_STRING was not defined');
    process.exit(1);
  }
};

export const envVars: Env = {
  PORT,
  BCRYPT_ROUNDS,
  JWT_SECRET,
  COOKIE_SECRET,
  COOKIE_DOMAIN,
  CORS_ORIGIN,
  DATABASE_STRING,
  REDIS_STRING,
  HOST,
};
