import type { NextApiRequest, NextApiResponse } from 'next';
import { DTO } from '@/types/transfer';
import { randomUUID } from 'crypto';
import { addNewTask } from '@/db/task-service';
import { parseSession } from '@/utils/utils';
import { getUserRole } from '@/db/user-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DTO.Task | { message: string }>
) {
  if (req.method === 'POST') {
    console.log('Запрошен проект дял добавления задачи: ', req.body);
    const projectId = req.body.projectId;
    const areaId = req.body.areaId;
    const session = parseSession(req.headers.cookie ?? '');

    if (typeof projectId !== 'string') {
      return res
        .status(400)
        .json({ message: 'Некорректный идентификатор проекта' });
    }

    const userRole = getUserRole(session.userId, projectId);

    if (!userRole || userRole === 'VIEWER') {
      return res
        .status(403)
        .json({ message: 'Недостаточно прав для выполнения действия' });
    }

    const newTask = {
      taskId: `${randomUUID()}`,
      tags: [],
      text: '',
      status: 'not completed',
      taskOwner: session.username,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      addNewTask(projectId, areaId, newTask);
      return res.status(200).json(newTask);
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' });
    }
  } else {
    res.status(404).json({ message: 'Выбран неверный метод' });
  }
}
