// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ['en', 'fr'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignore static assets, actions, Next internals, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) return;

  // Check if pathname already has a valid locale (e.g. /fr/dashboard)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // Read preferred language from cookie (set by our switcher)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  // Rewrite URL
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};