import { prisma } from '@/lib/prisma';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Feature Flag Service
// ═══════════════════════════════════════════════════════════

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const flag = await prisma.featureFlag.findUnique({
    where: { key },
  });
  return flag?.enabled || false;
}

export async function getAllFeatureFlags() {
  return prisma.featureFlag.findMany({
    orderBy: { key: 'asc' },
  });
}

export async function updateFeatureFlag(key: string, enabled: boolean) {
  return prisma.featureFlag.update({
    where: { key },
    data: { enabled },
  });
}

export async function createFeatureFlag(data: {
  key: string;
  enabled: boolean;
  description?: string;
}) {
  return prisma.featureFlag.create({
    data,
  });
}
