import type { NextApiRequest, NextApiResponse } from 'next';
import { Project } from '@/types/project';
import { getProjectsWithTags } from '@/db/task-service';
import cookie from 'cookie';

const authCheck = (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookie = cookie.parse(req.headers.cookie ?? '');

  console.log('cookie:', parsedCookie);
  if (!parsedCookie || !parsedCookie?.session) {
    res.status(401).send({ message: 'Not authorized' });
    return false;
  }

  console.log('session:', parsedCookie?.session);

  const { login, password } = JSON.parse(parsedCookie?.session ?? '');
  if (login !== 'user' || password !== 'qwerty') {
    res.status(401).send({ message: 'Not authorized' });
    return false;
  }

  return true;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[] | { message: string }>
) {
  if (req.method === 'GET') {
    if (!authCheck(req, res)) {
      return;
    }

    const data: Project[] = getProjectsWithTags();

    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
