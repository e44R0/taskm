export interface Task {
  taskId: string;
  tags: string[];
  text: string;
  taskOwner: string;
  createdAt: string;
}

export interface TaskData {
  projectId: string,
  task: Task,
  }