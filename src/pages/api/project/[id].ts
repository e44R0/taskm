import type { NextApiRequest, NextApiResponse } from 'next';
import { BE } from '@/types/backend';
import { getProjectDataByProjectId } from '@/db/project-service';
import { getUserRole } from '@/db/user-service';
// import { authCheck } from '@/utils/utils';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BE.Project | { message: string }>
) {
  const sessionHeader = req.headers['x-session'];

  if (Array.isArray(sessionHeader) || sessionHeader === undefined) {
    throw new Error('error: sessionHeader must be an array');
  }

  const session = JSON.parse(sessionHeader);

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res
      .status(400)
      .json({ message: 'Некорректный идентификатор проекта' });
  }

  const userRole = getUserRole(session.userId, id);

  if (!userRole) {
    return res
      .status(403)
      .json({ message: 'Недостаточно прав для выполнения действия' });
  }

  const project = getProjectDataByProjectId(id, session.userId);

  if (!project) {
    return res.status(404).json({ message: 'Проект не найден' });
  }

  res.status(200).json(project);
}
