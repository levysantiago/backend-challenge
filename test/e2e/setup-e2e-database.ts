import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();
/**
 * Function to generate database URL by editing the schema name.
 */
function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }
  const url = new URL(process.env.DATABASE_URL as string);
  url.searchParams.set('schema', schema);
  return url.toString();
}

// Generate database schema name
const schema = randomUUID();

beforeAll(() => {
  const databaseURL = generateDatabaseURL(schema);

  process.env.DATABASE_URL = databaseURL;

  // console.log('Setting up the test database...');
  execSync(
    `dotenv -e .env.test -v DATABASE_URL=${databaseURL} -- npx prisma migrate deploy`,
  );
});

afterAll(async () => {
  // console.log('Tearing down the test database...');
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);

  // Disconnect database or cleanup resources
  await prisma.$disconnect();
});
