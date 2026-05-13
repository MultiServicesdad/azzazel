import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- AZAZEL OSINT SEED START ---');

  // 1. Create Admin User
  const adminPassword = '4GRCAws9';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const azazelId = '0x' + crypto.randomBytes(64).toString('hex');

  const admin = await prisma.user.upsert({
    where: { email: 'jotadeveloperz@proton.me' },
    update: {},
    create: {
      email: 'jotadeveloperz@proton.me',
      username: 'administrator',
      passwordHash: hashedPassword,
      azazelId,
      role: 'SUPERADMIN',
      emailVerified: true,
      subscription: {
        create: {
          plan: 'ENTERPRISE',
          dailySearches: -1,
          searchResetAt: new Date(),
        },
      },
    },
  });

  console.log(`[Admin Created]`);
  console.log(`Email: jotadeveloperz@proton.me`);
  console.log(`Password: ${adminPassword}`);
  console.log(`Azazel ID: ${azazelId}`);

  // 2. Create Dummy Features
  const features = [
    { key: 'saved_results', enabled: true, description: 'Result persistence' },
    { key: 'API_SNUSBASE', enabled: true, description: 'Snusbase API Provider' },
    { key: 'API_LEAKCHECK', enabled: true, description: 'LeakCheck API Provider' },
    { key: 'API_LEAKOSINT', enabled: true, description: 'LeakOSINT API Provider' },
    { key: 'LIMIT_FREE_DAILY', enabled: true, description: 'Daily search limit for FREE users', metadata: { value: 3 } },
    { key: 'LIMIT_PREMIUM_DAILY', enabled: true, description: 'Daily search limit for PREMIUM users', metadata: { value: 100 } },
  ];

  for (const feature of features) {
    await prisma.featureFlag.upsert({
      where: { key: feature.key },
      update: {},
      create: feature,
    });
  }

  console.log(`[Feature Flags Seeded]`);

  // 3. Create Dummy Search Logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_INITIALIZATION',
      entity: 'system',
      severity: 'INFO',
      metadata: { version: '1.0.0' },
    },
  });

  console.log('--- AZAZEL OSINT SEED COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
