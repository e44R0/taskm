import type { NextApiRequest, NextApiResponse } from 'next';
import { BE } from '@/types/backend';
import { getProjectsWithTags } from '@/db/project-service';

import { parseSession } from '@/utils/utils';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BE.Project[] | { message: string }>
) {
  if (req.method === 'GET') {
    const session = parseSession(req.headers.cookie ?? '');
    const data: BE.Project[] = getProjectsWithTags(session.userId);
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
