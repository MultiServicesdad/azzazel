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

    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = subscriptions.map(s => ({
      user: s.user.username,
      email: s.user.email,
      plan: s.plan,
      status: s.status,
      since: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: s.plan === 'FREE' ? '$0' : s.plan === 'PREMIUM' ? '$29.99/mo' : '—'
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
