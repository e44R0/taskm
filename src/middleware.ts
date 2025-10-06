import { NextResponse, NextRequest } from 'next/server';
import { DTO } from './types/transfer';
import { deleteSession, getSession } from '@/db/auth-service';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

const sessionLiveTime = 24 * 60 * 60 * 1000;

const isSessionExpired = (date: Date) => {
  return Date.now() - Number(date) > sessionLiveTime;
};

export const authCheck = (req: NextRequest, res: NextResponse) => {
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

    return {
      userId: session.userId,
      username: session.username,
      email: session.email,
    };
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

export function middleware(request: NextRequest, response: NextResponse) {
  if (request.nextUrl.pathname !== '/api/check-auth') {
    console.log('call api:', request.url);
    const session = request.cookies.get('session');
    console.log('cookie:', session);
    return authCheck(request, response);
  }

  // return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  runtime: 'nodejs',
  matcher: '/api/:path*',
};
