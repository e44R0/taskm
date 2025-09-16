export namespace BE {
  export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
  };

  export interface Session {
    id: string;
    userId: string;
    createdAt: Date;
    username: string;
    email: string;
  }

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

  export interface Task {
    taskId: string;
    tags: string[];
    text: string;
    taskOwner: string;
    createdAt: string;
  }

  export type ProjectWithAreas = Project & { areas: Area[] };

  type Role = 'OWNER' | 'MODERATOR' | 'MEMBER' | 'VIEWER';
}
