import { createSession, getUserByName } from '@/db/auth-service';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
// import { encrypt } from '@/app/lib/session'

// type SessionData = {
//   login: string;
//   password: string;
// };

// const encrypt = (sessionData: SessionData) => {
//   return JSON.stringify(sessionData);
// };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionData = req.body;

  console.log('Ответ от БД: ', getUserByName(sessionData.login));
  const userData = getUserByName(sessionData.login);
  if (userData && userData.password === sessionData.password) {
    // const encryptedSessionData = encrypt(sessionData);
    const sessionId = randomUUID();
    console.log(sessionData);
    createSession(userData.id, sessionId);
    const cookie = serialize('session', sessionId, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });

    // const cookieExpired = serialize('session', sessionId, {
    //   httpOnly: true,
    //   secure: false,
    //   maxAge: 0,
    //   expires: "1970-01-01T00:00:00.000Z"
    //   path: '/',
    // });

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'Successfully set cookie!' });
  } else {
    res.status(401).json({ message: 'Not authorized session!' });
  }
}
