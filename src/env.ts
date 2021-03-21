import { config } from 'dotenv';

config();

export interface Env {
  PORT: number;
  JWT_SECRET: string;
  DATABASE_STRING: string;
  REDIS_STRING: string;
  BCRYPT_ROUNDS: number;
}

const PORT = Number.parseInt(process.env.PORT ?? '4000');
const BCRYPT_ROUNDS = Number.parseInt(process.env.BCRYPT_ROUNDS ?? '12');
const { JWT_SECRET, DATABASE_STRING, REDIS_STRING } = process.env;

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
  DATABASE_STRING,
  REDIS_STRING,
};