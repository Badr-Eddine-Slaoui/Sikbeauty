import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define routes/assets that must remain accessible
  const isExcluded =
    pathname.startsWith('/_next') ||          // Next.js dynamic static bundles
    pathname.startsWith('/api') ||            // API requests proxy
    pathname.startsWith('/admin') ||          // Admin dashboard views
    pathname.startsWith('/login') ||          // Direct URL login route
    pathname.startsWith('/maintenance') ||    // Maintenance page itself
    pathname.includes('.') ||                 // Static assets (images, icons, etc.)
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest';

  // If request matches excluded rules, proceed normally
  if (isExcluded) {
    return NextResponse.next();
  }

  // 2. Rewrite all other requests to the maintenance view (keeps original URL in browser bar)
  const url = request.nextUrl.clone();
  url.pathname = '/maintenance';
  return NextResponse.rewrite(url);
}

// Config to optimize middleware execution scope
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
