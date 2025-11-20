import { deleteSession, getSession } from '@/db/auth-service';
import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
// import { Session } from 'node:inspector';

const sessionLiveTime = 24 * 60 * 60 * 1000;

const isSessionExpired = (date: Date) => {
  return Date.now() - Number(date) > sessionLiveTime;
};

export const authCheck = (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookie = parse(req.headers.cookie ?? '');

  if (!parsedCookie || !parsedCookie?.session) {
    res.status(401).send({ message: 'Not authorized' });
    return null;
  }

  const session = getSession(parsedCookie?.session);

  if (!session || isSessionExpired(session.createdAt)) {
    if (session) {
      deleteSession(session.id);
    }
    res.status(401).send({ message: 'Not authorized' });
    return null;
  }

  return {
    userId: session.userId,
    username: session.username,
    email: session.email,
  };
};

export const parseSession = (cookie: string) => {
  const parsedCookie = parse(cookie ?? '');
  if (parsedCookie.session === undefined) {
    throw new Error('Could not parse session');
  }
  return getSession(parsedCookie.session);
};
