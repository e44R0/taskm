import type { NextApiRequest, NextApiResponse } from 'next';
import { DTO } from '@/types/transfer';
import { updateProject } from '@/db/task-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DTO.Project | { message: string }>
) {
  if (req.method === 'POST') {
    const updatedProject = req.body as DTO.Project;
    console.log(updatedProject);
    try {
      updateProject(updatedProject);
      return res.status(200).json(updatedProject);
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' });
    }
  } else {
    return res.status(405).end({ message: `Метод ${req.method} не разрешен` });
  }
}
