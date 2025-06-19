import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { authCheck } from '@/utils/utils';
import { Project } from '@/types/project';
import { addNewProject } from '@/db/task-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project | { message: string }>
) {
  if (req.method === 'POST') {
    const auth = authCheck(req, res);

    // if (typeof projectId !== 'string') {
    //   return res
    //     .status(400)
    //     .json({ message: 'Некорректный идентификатор проекта' });
    // }
    if (auth !== null) {
      const newProject = {
        id: `${randomUUID()}`,
        title: req.body.title,
        tags: req.body.tags ?? [],
        userId: auth.userId,
        isFavorite: false,
        createdAt: new Date().toString(),
        areas: [],
        username: auth.username,
      };

      try {
        addNewProject(newProject);
        return res.status(200).json(newProject);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: 'Ошибка при сохранении данных' });
      }
    }
  } else {
    res.status(404).json({ message: 'Выбран неверный метод' });
  }
}
