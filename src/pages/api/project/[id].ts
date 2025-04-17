import type { NextApiRequest, NextApiResponse } from 'next'
import { Project } from '@/types/project'
import { getProjectDataByProjectId } from '@/db/task-service'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project | { message: string }>
) {
  const { id } = req.query
  console.log('Запрошен проект: ', id)

  if (typeof id !== 'string') {
    return res
      .status(400)
      .json({ message: 'Некорректный идентификатор проекта' })
  }
  const project = getProjectDataByProjectId(id)
  console.log('project', project)

  if (!project) {
    return res.status(404).json({ message: 'Проект не найден' })
  }

  res.status(200).json(project)
}
