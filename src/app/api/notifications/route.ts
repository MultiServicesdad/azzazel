import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markAllAsRead } from '@/services/notification.service';
import { getUserFromToken } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';
    const notifications = await getNotifications(user.id, unreadOnly);

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await markAllAsRead(user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
