import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.challenge.deleteMany();

  // Create first challenge
  await prisma.challenge.create({
    data: {
      id: '3288fa32-1c78-42ed-b731-60b400531b24',
      title: 'new challenge 1',
      description: 'description',
    },
  });

  // Create second challenge
  await prisma.challenge.create({
    data: {
      id: '4288fa32-1c78-42ed-b731-60b400531b29',
      title: 'new challenge 2',
      description: 'description',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
