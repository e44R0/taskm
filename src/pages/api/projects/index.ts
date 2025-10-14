import type { NextApiRequest, NextApiResponse } from 'next';
import { Project } from '@/types/project';
import { getProjectsWithTags } from '@/db/project-service';
// import { authCheck } from '@/utils/utils';
import cookie from "cookie";
import {getSession} from "@/db/auth-service";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[] | { message: string }>
) {
  console.log('Projects --> Запросили проекты');
  if (req.method === 'GET') {

    const parsedCookie = cookie.parse(req.headers.cookie ?? '');
    const session = getSession(parsedCookie!.session!);
    console.log('Projects --> session user id', session.userId);

    // const auth = authCheck(req, res);
    // if (!auth) {
    //   return;
    // }

    const data: Project[] = getProjectsWithTags(session.userId);
    console.log('Projects --> Запрос обработан')

    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
