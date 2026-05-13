export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserFromToken(accessToken);
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          azazelId: user.azazelId,
          email: user.email,
          username: user.username,
          role: user.role,
          emailVerified: user.emailVerified,
          avatar: user.avatar,
          createdAt: user.createdAt.toISOString(),
          subscription: user.subscription
        }
      }
    });

    // Refresh role cookie for middleware
    const isSecure = process.env.SECURE_COOKIES === 'true';
    response.cookies.set('azazel_role', user.role, {
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
