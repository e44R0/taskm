import { NextResponse, NextRequest } from 'next/server';
import { deleteSession, getSession } from '@/db/auth-service';

const sessionLiveTime = 24 * 60 * 60 * 1000;

const isSessionExpired = (date: Date) => {
  return Date.now() - Number(date) > sessionLiveTime;
};

export const authCheck = (req: NextRequest) => {
  try {
    const { value } = req.cookies.get('session') ?? {};
    const parsedCookie = value; //cookie.parse(value);

    if (!parsedCookie) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const session = getSession(parsedCookie);

    if (!session || isSessionExpired(session.createdAt)) {
      if (session) {
        deleteSession(session.id);
      }
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-session', JSON.stringify(session));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
};

const ignoreRoutes = ['/api/login', '/api/check-auth'];

export function middleware(request: NextRequest) {
  if (!ignoreRoutes.includes(request.nextUrl.pathname)) {
    return authCheck(request);
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: '/api/:path*',
};
