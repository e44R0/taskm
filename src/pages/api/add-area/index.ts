import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { addNewArea } from '@/db/task-service';
import { getUserRole } from '@/db/user-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: string; title: string } | { message: string }>
) {
  if (req.method === 'POST') {
    const projectId = req.body.projectId;
    const sessionHeader = req.headers['x-session'];

    if (Array.isArray(sessionHeader) || sessionHeader === undefined) {
      throw new Error('error: sessionHeader must be an array');
    }

    if (typeof projectId !== 'string') {
      return res
        .status(400)
        .json({ message: 'Некорректный идентификатор проекта' });
    }

    const newArea = {
      id: `${randomUUID()}`,
      title: `New area`,
      tasks: [],
    };

    try {
      const session = JSON.parse(sessionHeader);
      const userRole = getUserRole(session.userId, projectId);

      console.log('userRole ->> ', userRole);

      if (!userRole || userRole === 'VIEWER' || userRole === 'MEMBER') {
        return res
          .status(403)
          .json({ message: 'Недостаточно прав для выполнения действия' });
      }

      addNewArea(projectId, newArea);
      return res.status(200).json(newArea);
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' });
    }
  } else {
    res.status(404).json({ message: 'Выбран неверный метод' });
  }
}
