import { createSession, getUserByEmail } from '@/db/auth-service';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { UserData } from '@/types/users';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionData = req.body;

  const userData = getUserByEmail(sessionData.login);
  if (userData && userData.password === sessionData.password) {
    const sessionId = randomUUID();

    console.log('user id, session id: ', userData.id, sessionId);
    createSession(userData.id, sessionId);
    const cookie = serialize('session', sessionId, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });

    const data: UserData = {
      userId: userData.id,
      username: userData.username,
      email: userData.email,
    };

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'Successfully set cookie!', data });
  } else {
    res.status(401).json({ message: 'Not authorized session!' });
  }
}
