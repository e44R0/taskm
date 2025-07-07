import type { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '@/types/task';
import {deleteProject} from '@/db/task-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | { message: string }>
) {
  if (req.method === 'POST') {
    const projectId = req.body.projectId;
    console.log('Удаление таска для проекта: ', projectId);

    if (typeof projectId !== 'string') {
      return res
        .status(400)
        .json({ message: 'Некорректный идентификатор проекта' });
    }

    try {
      deleteProject(projectId);
      return res
        .status(200)
        .json({ message: 'Проект была удален' });
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' });
    }
  } else {
    res.status(404).json({ message: 'Выбран неверный метод' });
  }
}
