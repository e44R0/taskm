import type { NextApiRequest, NextApiResponse } from 'next'
import { Task } from '@/types/task'
import { randomUUID } from 'crypto'
import { addNewTask } from '@/db/task-service'

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
      tags: [],
      text: '',
      taskOwner: 'Bob',
      createdAt: new Date().toISOString().split('T')[0],
    }

    try {
      addNewTask(projectId, areaId, newTask)
      return res.status(200).json(newTask)
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' })
    }
  } else {
    res.status(404).json({ message: 'Выбран неверный метод' })
  }
}
