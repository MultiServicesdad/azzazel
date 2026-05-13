export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [totalUsers, premiumUsers, queries24h, recentSearches] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { plan: 'PREMIUM' } }),
      prisma.search.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.search.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { username: true } }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        premiumUsers,
        queries24h,
        apiUptime: "99.98%",
        recentSearches: recentSearches.map(s => ({
          user: s.user.username,
          query: s.query,
          status: s.status === 'COMPLETED' ? 'SUCCESS' : s.status,
          time: new Date(s.createdAt).toISOString()
        }))
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
