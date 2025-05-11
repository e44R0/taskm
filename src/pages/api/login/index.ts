import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
// import { encrypt } from '@/app/lib/session'

type SessionData = {
  login: string;
  password: string;
};

const encrypt = (sessionData: SessionData) => {
  return JSON.stringify(sessionData);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionData = req.body;
  if (sessionData.login === 'user' && sessionData.password === 'qwerty') {
    const encryptedSessionData = encrypt(sessionData);
    console.log(sessionData);

    const cookie = serialize('session', encryptedSessionData, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'Successfully set cookie!' });
  } else {
    res.status(401).json({ message: 'Not authorized session!' });
  }
}
