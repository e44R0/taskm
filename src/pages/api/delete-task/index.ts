import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteTask } from '@/db/task-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method === 'POST') {
    const taskId = req.body.taskId;
    console.log('Удаление таска для проекта: ', taskId);

    if (typeof taskId !== 'string') {
      return res
        .status(400)
        .json({ message: 'Некорректный идентификатор задачи' });
    }

    try {
      deleteTask(taskId);
      return res
        .status(200)
        .json({ message: 'Задача была удалена на сревере' });
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' });
    }
  } else {
    res.status(404).json({ message: 'Выбран неверный метод' });
  }
}
