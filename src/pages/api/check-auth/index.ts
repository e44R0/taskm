import { authCheck } from '@/utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ResponseData } from '@/types/frontend/users';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const authResult = authCheck(req, res);

    if (authResult) {
      return res.status(200).json({
        message: 'Authentication successful',
        data: authResult
      });
    } else {
      return res.status(401).json({
        message: 'Not authorized',
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: 'An unexpected error occurred'
    });
  }
}
