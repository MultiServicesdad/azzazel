export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getUserApiKeys, createApiKey, deleteApiKey } from '@/services/apikey.service';
import { getUserFromToken } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const keys = await getUserApiKeys(user.id);
    return NextResponse.json({ success: true, data: keys });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Premium/Admin clearance check
    const hasApiAccess = ['PREMIUM', 'ADMIN', 'SUPERADMIN'].includes(user.role);
    if (!hasApiAccess) {
      return NextResponse.json({ error: 'Institutional API access requires Premium clearance' }, { status: 403 });
    }

    const { name, scopes } = await request.json();
    if (!name) return NextResponse.json({ error: 'Key name is required' }, { status: 400 });

    const key = await createApiKey(user.id, name, scopes || ['search']);
    return NextResponse.json({ success: true, data: key });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    await deleteApiKey(user.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
