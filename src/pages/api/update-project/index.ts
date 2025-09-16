import type { NextApiRequest, NextApiResponse } from 'next';
import { DTO } from '@/types/transfer';
import { projectActionsRoles, updateProject } from '@/db/project-service';
import { authCheck } from '@/utils/utils';
import { getUserRole, isUserMatchRoles } from '@/db/user-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DTO.Project | { message: string }>
) {
  if (req.method === 'POST') {
    const auth = authCheck(req, res);
    if (!auth) {
      return;
    }

    const updatedProject = req.body as DTO.Project;

    try {
      const userRole = getUserRole(auth.userId, updatedProject.id);
      if (!isUserMatchRoles(userRole, projectActionsRoles.update)) {
        return res.status(403).json({ message: 'Недостаточно прав' });
      }

      updateProject(updatedProject, auth.userId);
      return res.status(200).json(updatedProject);
    } catch {
      return res.status(500).json({ message: 'Ошибка при сохранении данных' });
    }
  } else {
    return res.status(405).end({ message: `Метод ${req.method} не разрешен` });
  }
}
