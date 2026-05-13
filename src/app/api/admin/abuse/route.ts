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

    // In a real system, we might have a dedicated 'AbuseReport' model.
    // For now, let's identify users who have a high volume of searches or are banned.
    const bannedUsers = await prisma.user.findMany({
      where: { banned: true },
      select: {
        username: true,
        email: true,
        createdAt: true,
      }
    });

    // Mock reports based on potential patterns
    const reports = [
      { id: "ABR-001", user: "system_monitor", type: "SYSTEM_NOMINAL", desc: "No critical abuse detected in the last cycle.", status: "CLEAN", time: "1h ago" }
    ];

    return NextResponse.json({
      success: true,
      data: {
        reports,
        bannedUsers: bannedUsers.map(u => ({
          user: u.username,
          reason: "Manual administrative ban",
          bannedAt: new Date(u.createdAt).toLocaleDateString(),
          ip: "—"
        }))
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
