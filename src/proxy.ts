import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Handle Admin pages
  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isLoginPage = pathname === '/admin/login';

    if (!token) {
      // If not logged in and trying to access any page other than /admin/login,
      // redirect to /admin/login with callbackUrl
      if (!isLoginPage) {
        const callbackUrl = encodeURIComponent(pathname + search);
        const loginUrl = new URL(`/admin/login?callbackUrl=${callbackUrl}`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // If logged in and trying to access /admin/login, redirect to /admin
      if (isLoginPage) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  // Handle API protection
  if (pathname.startsWith('/api')) {
    const isEnquiryGetOrPatch = pathname === '/api/enquiries';
    const isWriteRequest = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
    
    // Exception: POST /api/enquiries is public (submitting an enquiry form)
    const isPublicEnquiryPost = pathname === '/api/enquiries' && request.method === 'POST';

    // Exception: GET/POST /api/auth/* is public (next-auth calls)
    const isAuthApi = pathname.startsWith('/api/auth');

    if ((isWriteRequest || isEnquiryGetOrPatch) && !isPublicEnquiryPost && !isAuthApi) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
