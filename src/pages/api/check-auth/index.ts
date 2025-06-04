import { authCheck } from '@/utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (authCheck(req, res)) {
    res.status(200).json({ message: 'all good' });
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
}
