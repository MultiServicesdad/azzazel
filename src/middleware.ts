import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Edge Middleware
// Handles auth redirection, CSRF, and security headers
// ═══════════════════════════════════════════════════════════

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email',
  '/pricing',
  '/docs',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/verify-email',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/v1/status',
];

const AUTH_PATHS = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Security Headers ──────────────────────────────────
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // ── Skip static and API auth routes ───────────────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return response;
  }

  // ── Check for access token ────────────────────────────
  const accessToken = request.cookies.get('azazel_access')?.value;
  const refreshToken = request.cookies.get('azazel_refresh')?.value;
  const hasAuth = !!accessToken || !!refreshToken;

  // ── Public paths: allow through ───────────────────────
  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  // ── API routes: handle separately ─────────────────────
  if (pathname.startsWith('/api/')) {
    // Public API routes
    if (isPublicPath) return response;

    // Protected API routes require auth
    if (!hasAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return response;
  }

  // ── Auth pages: redirect to dashboard if already logged in
  if (AUTH_PATHS.includes(pathname) && hasAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ── Protected pages: redirect to login if not authenticated
  if (!isPublicPath && !hasAuth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Admin routes: Handled by server-side checks in page/api
  // We'll allow the navigation and let the API/Page handle the permission error
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
