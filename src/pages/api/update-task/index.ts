import type { NextApiRequest, NextApiResponse } from 'next';
import { DTO } from '@/types/transfer';
import { updateTask } from '@/db/task-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DTO.TaskData>
) {
  if (req.method === 'POST') {
    const updatedTask: DTO.Task = req.body;

    const sessionHeader = req.headers['x-session'];

    if (Array.isArray(sessionHeader) || sessionHeader === undefined) {
      throw new Error('error: sessionHeader must be an array');
    }

    const session = JSON.parse(sessionHeader);

    try {
      updateTask(updatedTask, session.userId);
      return res.status(200).json({ data: updatedTask });
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' });
    }
  } else {
    return res.status(405).end({ message: `Метод ${req.method} не разрешен` });
  }
}
