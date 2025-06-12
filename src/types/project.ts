import { Area } from './area';

export interface Project {
  id: string;
  title: string;
  tags: string[];
  userId: string;
  isFavorite: boolean;
  createdAt: string;
  areas: Area[];
  username: string;
}
