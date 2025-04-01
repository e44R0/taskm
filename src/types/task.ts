import {ParsedUrlQuery} from "node:querystring";

export interface Task {
  taskId: string;
  tags: string[];
  text: string;
  taskOwner: string;
  createdAt: string;
}

export interface TaskData {
  projectId: ParsedUrlQuery,
  task: Task,
  }