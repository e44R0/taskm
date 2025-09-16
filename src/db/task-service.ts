import db from '../../scripts/init-db.mjs';
import { BE } from '@/types/backend';
import { DTO } from '@/types/transfer';

export function getAreasByProjectId(projectId: string) {
  const stmt = db.prepare(`
    SELECT * FROM areas WHERE project_id = ?
  `);
  const result = stmt.all(projectId);
  return result as BE.Area[];
}

export function getTasksByProjectId(projectId: string) {
  const stmt = db.prepare(`
    SELECT t.*
    FROM tasks t
    JOIN areas a ON t.area_id = a.id
    WHERE a.project_id = ?
  `);
  const result = stmt.all(projectId);
  return result as BE.Task[];
}

export function addNewTask(
  project_id: string,
  area_id: string,
  task: DTO.Task
) {
  const stmt =
    db.prepare(`INSERT INTO tasks (task_id, text, task_owner, created_at, area_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(task.taskId, task.text, task.taskOwner, task.createdAt, area_id);
}

export function updateTask(task: DTO.Task) {
  const stmt = db.prepare(`UPDATE tasks
      SET
        text = ?,
        task_owner = ?
      WHERE
        task_id = ?
  `);
  stmt.run(task.text, task.taskOwner, task.taskId);
}

export function deleteTask(taskId: string) {
  const stmt = db.prepare(`DELETE FROM tasks WHERE task_id = ?`);
  stmt.run(taskId);
}

export function addNewArea(
  projectId: string,
  area: { id: string; title: string }
) {
  const stmt = db.prepare(`INSERT INTO areas (title, project_id, id)
                           VALUES (?, ?, ?) `);
  stmt.run(area.title, projectId, area.id);
}
