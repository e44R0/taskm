import { Area, Project } from '@/types/backend';

export namespace FE {
  export type User = {
    userId: string;
    username: string;
    email: string;
  };

  export interface Project {
    id: string;
    title: string;
    tags: string[];
    userId: string;
    isFavorite: boolean;
    createdAt: string;
    username: string;
  }

  export interface Area {
    id: string;
    title: string;
    tasks: Task[];
  }

  export type ProjectWithAreas = Project & { areas: Area[] };

  export interface Task {
    taskId: string;
    tags: string[];
    text: string;
    taskOwner: string;
    createdAt: string;
  }
}
