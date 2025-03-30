import {ParsedUrlQuery} from "node:querystring";

export interface Task {
  id: string;
  tags: string[];
  text: string;
  taskOwner: string;
  createdAt: string;
}

export interface TaskData {
  projectId: ParsedUrlQuery,
  task: Task,
  }