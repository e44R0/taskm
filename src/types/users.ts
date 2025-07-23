export interface User {
  id: string
  username: string
  email: string
  password: string
  createdAt: string
}

export type UserData = {
  userId: string;
  username: string;
  email: string;
}

export type ResponseData = {
  message: string;
  data?: UserData;
  error?: string;
};
