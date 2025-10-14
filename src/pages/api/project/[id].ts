import type { NextApiRequest, NextApiResponse } from 'next';
import { Project } from '@/types/project';
import { getProjectDataByProjectId } from '@/db/project-service';
import cookie from "cookie";
import {getSession} from "@/db/auth-service";
// import { authCheck } from '@/utils/utils';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project | { message: string }>
) {
  // const result = authCheck(req, res);
  // if (result === null) {
  //   return;
  // }
  // result.userId;
  const parsedCookie = cookie.parse(req.headers.cookie ?? '');
  const session = getSession(parsedCookie!.session!);

  const { id } = req.query;
  console.log('Запрошен проект: ', id);

  if (typeof id !== 'string') {
    return res
      .status(400)
      .json({ message: 'Некорректный идентификатор проекта' });
  }
  const project = getProjectDataByProjectId(id, session.userId);
  console.log('project', project);

  if (!project) {
    return res.status(404).json({ message: 'Проект не найден' });
  }

  res.status(200).json(project);
}
