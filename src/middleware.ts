import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from './lib/auth';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect /dashboard and its subroutes
    if (path.startsWith('/dashboard')) {
        const authToken = request.cookies.get(AUTH_COOKIE_NAME);

        if (!authToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect to /dashboard if already logged in and visiting /login
    if (path === '/login') {
        const authToken = request.cookies.get(AUTH_COOKIE_NAME);
        if (authToken) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
