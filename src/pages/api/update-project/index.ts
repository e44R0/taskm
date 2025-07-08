import type { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '@/types/task';
import { updateProject } from '@/db/task-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | string>
) {
  if (req.method === 'POST') {
    const updatedProject = req.body;
    console.log(updatedProject);
    try {
      console.log('перед записью');
      updateProject(updatedProject);
      console.log('по завершению записи');
      return res.status(200).json(updatedProject);
    } catch {
      return res.status(500).json('Ошибка при сохранении данных');
    }
  } else {
    return res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
