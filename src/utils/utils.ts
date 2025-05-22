import { getSession } from '@/db/auth-service';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

const sessionLiveTime = 24 * 60 * 60 * 1000;

const isSessionExpired = (date: Date) => {
  return Date.now() - Number(date) > sessionLiveTime;
};

export const authCheck = (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookie = cookie.parse(req.headers.cookie ?? '');

  console.log('cookie:', parsedCookie);
  if (!parsedCookie || !parsedCookie?.session) {
    res.status(401).send({ message: 'Not authorized' });
    return false;
  }

  console.log('session from cookie:', parsedCookie?.session);

  const session = getSession(parsedCookie?.session);
  console.log('session:', session);
  console.log('isSessionExpired: ', Date.now(), Number(session.createdAt));

  //const { login, password } = JSON.parse(parsedCookie?.session ?? '');
  if (!session || isSessionExpired(session.createdAt)) {
    res.status(401).send({ message: 'Not authorized' });
    return false;
  }

  return true;
};
