import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAllFeatureFlags } from '@/services/feature.service';
import { getUserFromToken } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const flags = await getAllFeatureFlags();
    return NextResponse.json({ success: true, data: flags });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { key, enabled, metadata } = await request.json();
    
    const flag = await prisma.featureFlag.update({
      where: { key },
      data: { 
        ...(enabled !== undefined && { enabled }),
        ...(metadata !== undefined && { metadata }),
      },
    });

    return NextResponse.json({ success: true, data: flag });
  } catch (error) {
    console.error('[Features API Error]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
