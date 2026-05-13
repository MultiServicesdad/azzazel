import { prisma } from '@/lib/prisma';
import { generateRandomHex, sha256 } from '@/lib/crypto-utils';
import type { PlanType } from '@/types';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — API Key Service
// ═══════════════════════════════════════════════════════════

export async function validateApiKey(key: string) {
  if (!key.startsWith('az_live_')) return null;

  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          subscription: {
            select: {
              plan: true,
              status: true,
              dailySearches: true,
              searchesUsed: true,
            }
          }
        }
      }
    }
  });

  if (!apiKey || !apiKey.active) return null;

  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date(), usageCount: { increment: 1 } }
  });

  return {
    userId: apiKey.userId,
    user: apiKey.user,
    plan: (apiKey.user.subscription?.plan || 'FREE') as PlanType,
    permissions: apiKey.permissions as string[],
  };
}

export async function createApiKey(userId: string, name: string, scopes: string[]) {
  const rawKey = `az_live_${generateRandomHex(32)}`;
  const prefix = rawKey.substring(0, 16);
  const hashedKey = await sha256(rawKey);
  
  const created = await prisma.apiKey.create({
    data: {
      userId,
      name,
      key: rawKey,
      prefix,
      hashedKey,
      permissions: scopes,
      active: true,
    },
  });

  return { ...created, rawKey };
}

export async function deleteApiKey(userId: string, keyId: string) {
  return prisma.apiKey.delete({
    where: {
      id: keyId,
      userId,
    },
  });
}

export async function getUserApiKeys(userId: string) {
  return prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
