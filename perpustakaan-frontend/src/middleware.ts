import { NextResponse } from 'next/server';
import { getCookie } from 'cookies-next';
import type { NextRequest } from 'next/server';
import { getAuth } from '../api/fetch/getAuth';

export async function middleware(request: NextRequest) {
    const cookie = getCookie('token', { req: request });

    if (!cookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const auth = await getAuth(cookie);
        
        if(request.nextUrl.pathname.startsWith('/user') && auth.role_id !== 1) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if((request.nextUrl.pathname.startsWith('/rent') || 
        request.nextUrl.pathname.startsWith('/librarianRentHistory') ||
        request.nextUrl.pathname.startsWith('/book') || 
        request.nextUrl.pathname.startsWith('/category') ||
        request.nextUrl.pathname.startsWith('/return')) && 
        (auth.role_id !== 1 && auth.role_id !== 2)) {
            return NextResponse.redirect(new URL('/', request.url));
        }

    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/book', '/book/:path*', '/category', '/category/:path*', '/detail', '/detail/:path*', '/librarianRentHistory', 
        '/rent', '/rent/:path*', '/user', '/user/:path*'
    ]
};
