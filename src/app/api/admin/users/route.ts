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

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        banned: true,
        createdAt: true,
        _count: {
          select: { searches: true }
        }
      }
    });

    const formattedUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      status: u.banned ? 'BANNED' : 'ACTIVE',
      searches: u._count.searches,
      joined: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    }));

    return NextResponse.json({ success: true, data: formattedUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await getUserFromToken(accessToken);
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, action, role } = await request.json();

    if (action === 'BAN') {
      await prisma.user.update({ where: { id: userId }, data: { banned: true } });
    } else if (action === 'UNBAN') {
      await prisma.user.update({ where: { id: userId }, data: { banned: false } });
    } else if (action === 'UPDATE_ROLE' && role) {
      await prisma.user.update({ where: { id: userId }, data: { role } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
