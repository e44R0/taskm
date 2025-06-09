import type { NextApiRequest, NextApiResponse } from 'next';
import { Project } from '@/types/project';
import { getProjectsWithTags } from '@/db/task-service';
import { authCheck } from '@/utils/utils';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[] | { message: string }>
) {
  if (req.method === 'GET') {
    const auth = authCheck(req, res);
    if (!auth) {
      return;
    }

    const data: Project[] = getProjectsWithTags(auth.userId);

    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
