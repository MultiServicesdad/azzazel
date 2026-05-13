import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/services/apikey.service';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const key = authHeader.split(' ')[1];
  const auth = await validateApiKey(key);

  if (!auth) {
    return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: auth.user.id,
        username: auth.user.username,
        email: auth.user.email,
        clearance: auth.user.role,
      },
      subscription: auth.user.subscription,
      permissions: auth.permissions,
    }
  });
}
