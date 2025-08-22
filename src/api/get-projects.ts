import { FE } from '@/types/frontend';
import { DTO } from '@/types/transfer';
import { fetcher } from './fetcher';
import { NextRouter } from 'next/router';

export const fetchProject = async (
  id: string,
  router: NextRouter
): Promise<FE.ProjectWithAreas> => {
  const dtoProject = await fetcher<DTO.ProjectWithAreas>({
    method: 'GET',
    src: `/api/project/${id}`,
    router,
  });

  // transform DTO to FE if necessary

  return dtoProject as FE.ProjectWithAreas;
};
