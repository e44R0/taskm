import type { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '@/types/task';
import { updateTask } from '@/db/task-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | string>
) {
  if (req.method === 'POST') {
    const updatedTask: Task = req.body;

    try {
      updateTask(updatedTask);
      return res.status(200).json(updatedTask);
    } catch {
      return res.status(500).json('Ошибка при сохранении данных');
    }
  } else {
    return res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
