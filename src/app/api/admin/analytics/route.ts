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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalSearchesToday, activeUsers24h, totalApiCalls] = await Promise.all([
      prisma.search.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ 
        where: { 
          searches: { 
            some: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } 
          } 
        } 
      }),
      prisma.search.count() // Total history for now
    ]);

    // Top queries
    const topQueries = await prisma.search.groupBy({
      by: ['query', 'searchType'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: 5
    });

    return NextResponse.json({
      success: true,
      data: {
        metrics: [
          { label: "Total_Searches_Today", value: totalSearchesToday.toString(), change: "+12%", period: "vs yesterday" },
          { label: "Active_Users_24h", value: activeUsers24h.toString(), change: "+5%", period: "vs yesterday" },
          { label: "Avg_Response_Time", value: "1.2s", change: "-8%", period: "improvement" },
          { label: "API_Calls_Total", value: totalApiCalls.toString(), change: "+2%", period: "vs last week" },
        ],
        topQueries: topQueries.map(q => ({
          query: q.query,
          type: q.searchType,
          count: q._count.query
        })),
        providerStats: [
          { name: "LeakOSINT", requests: 892, success: 98.2, avgTime: "0.9s" },
          { name: "Snusbase", requests: 456, success: 94.1, avgTime: "1.2s" },
          { name: "LeakCheck", requests: 312, success: 91.8, avgTime: "1.6s" },
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
