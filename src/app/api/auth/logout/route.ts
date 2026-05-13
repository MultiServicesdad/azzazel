import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/services/auth.service';
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear all auth cookies
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete('azazel_access');
    response.cookies.delete('azazel_role');
    response.cookies.delete(CSRF_COOKIE_NAME);

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
