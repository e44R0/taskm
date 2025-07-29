import { User as FEUser } from '@/types/frontend/users';

export type ResponseData = {
  message: string;
  data?: FEUser;
  error?: string;
};

