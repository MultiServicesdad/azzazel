import { prisma } from '@/lib/prisma';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Saved Results Service
// ═══════════════════════════════════════════════════════════

export async function saveSearchResult(params: {
  userId: string;
  searchId: string;
  name?: string;
  notes?: string;
  tags?: string[];
}) {
  return prisma.savedResult.create({
    data: {
      userId: params.userId,
      searchId: params.searchId,
      name: params.name,
      notes: params.notes,
      tags: params.tags || [],
    },
  });
}

export async function getSavedResults(userId: string) {
  return prisma.savedResult.findMany({
    where: { userId },
    include: {
      search: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteSavedResult(userId: string, id: string) {
  return prisma.savedResult.delete({
    where: {
      id,
      userId,
    },
  });
}
