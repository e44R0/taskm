import db from '../../scripts/init-db.mjs';
import { BE } from '@/types/backend';
import { DTO } from '@/types/transfer';
import { v4 as uuidv4 } from 'uuid';

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

function deleteTagsInTask(userId: string, task: DTO.Task) {
  const selectTagsFromCurrentTaskStmt = db.prepare<
    [string, string],
    { tag_name: string; tag_id: string }
  >(
    `SELECT t.tag_name, tt.tag_id FROM tags t 
                JOIN task_tags tt ON tt.tag_id = t.id  
                WHERE t.user_id = ? AND tt.task_id = ?`
  );
  const tagsInTask = selectTagsFromCurrentTaskStmt.all(userId, task.taskId);

  const tagsToDel = tagsInTask.filter(
    (tag) => !task.tags.includes(tag.tag_name)
  );

  tagsToDel.forEach((tag) => {
    try {
      const stmt = db.prepare(
        `DELETE FROM task_tags where task_id = ? AND tag_id = ?`
      );
      stmt.run(task.taskId, tag.tag_id);
    } catch (error) {
      console.error(error);
    }
  });
  console.log('tagsToDel -> ', tagsToDel);
}

function addNewTagsInTask(userId: string, task: DTO.Task) {
  const selectTagsStmt = db.prepare<[string], { tag_name: string }>(
    `SELECT tag_name FROM tags WHERE user_id = ?`
  );

  const userTags = selectTagsStmt.all(userId);
  const tagNamesArray = userTags.map((row) => row.tag_name);

  console.log('tagNamesArray -> ', tagNamesArray);

  const taskTags = task.tags;
  const newTags = taskTags.filter((tag) => !tagNamesArray.includes(tag));

  newTags.forEach((tag) => {
    try {
      const tagId = uuidv4();
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO tags (id, user_id ,tag_name)
               values (?,?,?)      
       `);
      const runResult = stmt.run(tagId, userId, tag);
      console.log('runResult ->>> ', runResult);

      if (runResult.changes !== 0) {
        const stmt2 = db.prepare(`
            INSERT OR IGNORE INTO task_tags (task_id, tag_id)
            values (?,?)
        `);
        stmt2.run(task.taskId, tagId);
      }
    } catch (error) {
      console.error(error);
    }
  });
}

export function updateTask(task: DTO.Task, userId: string) {
  const stmt = db.prepare(`UPDATE tasks
      SET
        text = ?,
        task_owner = ?
      WHERE
        task_id = ?
  `);
  stmt.run(task.text, task.taskOwner, task.taskId);

  addNewTagsInTask(userId, task);

  deleteTagsInTask(userId, task);
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
