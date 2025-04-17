import type { NextApiRequest, NextApiResponse } from 'next'
import projects from '@/mocks/projects.json'
import { Task } from '@/types/task'
import { getStoragePath, writeToFile } from '@/utils/utils'
import { randomUUID } from 'crypto'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | { message: string }>
) {
  if (req.method === 'POST') {
    console.log('Запрошен проект дял добавления карты: ', req.body)
    const projectId = req.body.projectId
    const areaId = req.body.areaId

    if (typeof projectId !== 'string') {
      return res
        .status(400)
        .json({ message: 'Некорректный идентификатор проекта' })
    }

    const newTask = {
      taskId: `${randomUUID()}`,
      tags: ['select tag'],
      text: 'Enter ur text here',
      taskOwner: 'Bob',
      createdAt: new Date().toISOString().split('T')[0],
    }

    try {
      await writeToFile(getStoragePath(), projects)
      return res.status(200).json(newTask)
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' })
    }
  } else {
    res.status(404).json({ message: 'Выбран неверный метод' })
  }
}
