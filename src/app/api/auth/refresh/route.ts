export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken, generateCsrfToken } from '@/services/auth.service';
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'No refresh token' },
        { status: 401 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await refreshAccessToken({
      refreshToken,
      ip,
      userAgent,
    });

    const csrfToken = generateCsrfToken();
    const isSecure = process.env.SECURE_COOKIES === 'true';
    const domain = process.env.COOKIE_DOMAIN || undefined;

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      },
      { status: 200 }
    );

    // Rotate refresh token cookie
    response.cookies.set(AUTH_COOKIE_NAME, result.refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      domain,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Update access token cookie
    response.cookies.set('azazel_access', result.accessToken, {
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      domain,
      path: '/',
      maxAge: 15 * 60,
    });

    // Update role cookie
    response.cookies.set('azazel_role', result.user.role, {
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      domain,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Update CSRF
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      domain,
      path: '/',
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Refresh failed';

    const response = NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    );

    // Clear cookies on failure
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete('azazel_access');
    response.cookies.delete('azazel_role');

    return response;
  }
}
