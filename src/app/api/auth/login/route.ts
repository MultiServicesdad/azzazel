export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { loginUser, generateCsrfToken } from '@/services/auth.service';
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME } from '@/lib/constants';
import { checkRateLimit } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Brute force protection: 5 attempts per 15 minutes per IP/User
    const rateLimit = await checkRateLimit(`rl:login:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const { user, accessToken, refreshToken, expiresAt } = await loginUser({
      identifier: result.data.identifier,
      password: result.data.password,
      ip,
      userAgent,
      rememberSession: result.data.rememberSession,
    });

    const csrfToken = generateCsrfToken();
    const isSecure = process.env.SECURE_COOKIES === 'true';
    const domain = process.env.COOKIE_DOMAIN || undefined;

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: { user, accessToken },
      },
      { status: 200 }
    );

    // Set HttpOnly refresh token cookie
    response.cookies.set(AUTH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      domain,
      path: '/',
      expires: expiresAt,
    });

    // Set access token cookie (readable by JS for client-side auth checks)
    response.cookies.set('azazel_access', accessToken, {
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      domain,
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    // Set role cookie for middleware (non-sensitive)
    response.cookies.set('azazel_role', user.role, {
      httpOnly: false,
      secure: isSecure,
      sameSite: 'lax',
      domain,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days (matching refresh token)
    });

    // Set CSRF token
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
    const message = error instanceof Error ? error.message : 'Login failed';
    const status = message.includes('credentials')
      ? 401
      : message.includes('suspended')
      ? 403
      : 500;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
