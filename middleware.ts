import { NextRequest, NextResponse } from 'next/server';
import { getUserSessionId, updateUserSession } from '@/lib';

export async function middleware(request: NextRequest) {
  if (await getUserSessionId()) {
    return await updateUserSession(request);
  }
  return NextResponse.rewrite(request.url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
