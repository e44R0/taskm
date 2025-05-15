import { Project } from '@/types/project';
import { fetcher } from './fetcher';
import { NextRouter } from 'next/router';

export const fetchProject = async (
  id: string,
  router: NextRouter
): Promise<Project> => {
  return await fetcher({
    method: 'GET',
    src: `/api/project/${id}`,
    router,
  });
};
