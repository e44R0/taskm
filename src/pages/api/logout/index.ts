import { deleteSession } from '@/db/auth-service';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = req.cookies.session;

  if (session && req.method === 'POST') {
    const cookie = serialize('session', session, {
      httpOnly: true,
      secure: false,
      maxAge: 0,
      expires: new Date('1970-01-01T00:00:00.000Z'),
      path: '/',
    });

    deleteSession(session);

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'Logged out successfully!' });
  } else {
    res.status(401).json({ message: 'Failed to logout!' });
  }
}
