import type { NextApiRequest, NextApiResponse } from 'next'
import projects from '@/mocks/projects.json'
import { TaskData } from '@/types/task'
import { getStoragePath, writeToFile } from '@/utils/utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TaskData | string>
) {
  if (req.method === 'POST') {
    const updatedTask: TaskData = req.body
    // console.log("НА СТОРОНЕ СЕРВЕРА: данные получены!", updatedTask);

    let taskUpdated = false
    projects.forEach((project) =>
      project.areas.forEach((area) => {
        area.tasks.forEach((task) => {
          if (task.taskId === updatedTask.task.taskId) {
            task.text = updatedTask.task.text
            task.tags = updatedTask.task.tags || task.tags
            taskUpdated = true
          }
        })
      })
    )

    if (!taskUpdated) {
      return res.status(404).json('Задача не найдена')
    }

    try {
      await writeToFile(getStoragePath(), projects)
      return res.status(200).json(updatedTask)
    } catch {
      return res.status(500).json('Ошибка при сохранении данных')
    }
  } else {
    return res.status(405).end(`Метод ${req.method} не разрешен`)
  }
}
