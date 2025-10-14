import { NextResponse, NextRequest } from 'next/server';
import { deleteSession, getSession } from '@/db/auth-service';

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
    console.log('authCheck success');
    return NextResponse.next();
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error 2',
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
};

const ignoreRoutes = ['/api/login', '/api/check-auth'];
//

export function middleware(request: NextRequest, response: NextResponse) {
  console.log('middleware: ', request.nextUrl.pathname);
  if (!ignoreRoutes.includes(request.nextUrl.pathname)) {
    console.log('call api:', request.url);
    const session = request.cookies.get('session');
    console.log('cookie:', session);
    return authCheck(request, response);
  }

  return NextResponse.next();
  // return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  runtime: 'nodejs',
  matcher: '/api/:path*',
};

//дабвить хедер с  ID пользователя и его парсить при выполнении запроса
