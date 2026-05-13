import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('Connection successful');
    const users = await prisma.user.count();
    console.log('User count:', users);
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
