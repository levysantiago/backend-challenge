import { z } from 'zod';
import { config } from 'dotenv';
import { resolve } from 'path';

let envFile = '.env';
if (process.env.NODE_ENV === 'test') {
  envFile = '.env.test';
}
config({ path: resolve(__dirname, `../../../../${envFile}`), override: true });

const createEnvSchema = z.object({
  // API
  SERVER_PORT: z.coerce.number(),

  // DATABASE
  DATABASE_URL: z.string(),

  // GITHUB
  GITHUB_ACCESS_TOKEN: z.string(),

  // KAFKA
  KAFKA_BROKER_URL: z.string(),
});
const _env = createEnvSchema.safeParse(process.env);

if (_env.success === false) {
  console.log('Invalid environment variables!', _env.error.format());

  throw new Error(`Invalid environment variables!`);
}

export const env = _env.data;
