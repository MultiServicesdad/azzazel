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

    // Mock system metrics for the UI
    const metrics = {
      cpuUsage: Math.floor(Math.random() * 15) + 5 + "%",
      memoryUsage: (Math.random() * 0.5 + 1.1).toFixed(1) + " / 4 GB",
      diskUsage: "12.4 / 50 GB",
      uptime: "14d 6h 22m",
      services: [
        { name: "PostgreSQL", version: "16.2", status: "RUNNING", port: "5432" },
        { name: "Redis", version: "7.2", status: "RUNNING", port: "6379" },
        { name: "Next.js", version: "16.2.6", status: "RUNNING", port: "3000" },
        { name: "Prisma_Client", version: "6.8", status: "CONNECTED", port: "—" },
      ]
    };

    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
