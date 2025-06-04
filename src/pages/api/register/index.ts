import { createUser, getUserByEmail } from '@/db/auth-service';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const regData = req.body;
  console.log(regData);
  console.log(getUserByEmail(regData.email));
  const userData = getUserByEmail(regData.email);

  if (userData) {
    res
      .status(409)
      .json({
        message: 'Registration error, your email address may already be taken.',
      });
  }

  if (!userData) {
    const userId = randomUUID();
    createUser(userId, regData.login, regData.password, regData.email);
    res.status(200).json({ message: 'Новый пользователь зарегистрирован' });
  } else {
    res.status(401).json({ message: 'Что-то пошло не по плану' });
  }
}
