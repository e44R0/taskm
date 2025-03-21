import { Task } from "./task";

export interface Area {
  id: string;
  title: string;
  tasks: Task[];
}
