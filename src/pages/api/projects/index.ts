import type { NextApiRequest, NextApiResponse } from 'next'
import { Project } from '@/types/project'
import { getProjectsWithTags } from '@/db/task-service'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[] | { message: string }>
) {
  if (req.method === 'GET') {
    const data: Project[] = getProjectsWithTags()
    console.log(data)
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Метод не разрешен' })
  }
}
