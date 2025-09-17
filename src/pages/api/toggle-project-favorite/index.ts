import type { NextApiRequest, NextApiResponse } from 'next';
import { toggleProjectFavorite } from '@/db/project-service';
import { authCheck } from '@/utils/utils';
import { BE } from '@/types/backend';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BE.Project | { message: string }>
) {
  if (req.method === 'POST') {
    const projectId = req.body.projectId;
    const auth = authCheck(req, res);
    if (!auth) {
      return;
    }

    const data: BE.Project = toggleProjectFavorite(projectId, auth.userId);
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
