import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { BE } from '@/types/backend';
import { addNewProject } from '@/db/project-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BE.Project | { message: string }>
) {
  if (req.method === 'POST') {
    const sessionHeader = req.headers['x-session'];
    if (Array.isArray(sessionHeader) || sessionHeader === undefined) {
      throw new Error('error: sessionHeader must be an array');
    }

    const session = JSON.parse(sessionHeader);

    if (session !== null) {
      const newProject = {
        id: `${randomUUID()}`,
        title: req.body.title,
        tags: req.body.tags ?? [],
        userId: session.userId,
        isFavorite: false,
        createdAt: new Date().toString(),
        areas: [],
        username: session.username,
        userRole: session.userRole,
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
