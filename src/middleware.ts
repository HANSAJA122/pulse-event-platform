import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Ignore api routes, _next, static files, auth callback routes
  matcher: ['/', '/(en|fr|es)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
