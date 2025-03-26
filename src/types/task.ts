export interface Task {
  id: string;
  tags?: string[];
  text: string;
  taskOwner: string;
  createdAt: string;
}
