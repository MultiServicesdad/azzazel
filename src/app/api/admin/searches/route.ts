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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const searches = await prisma.search.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            azazelId: true,
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: searches });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
