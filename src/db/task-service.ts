import db from './init-db.mjs';
// import { Task } from '@/types/task'
import { User } from '@/types/users';
import { Project } from '@/types/project';
import { Area } from '@/types/area';
import { Task } from '@/types/task';

export function createUser(user: User) {
  const stmt = db.prepare(`
    INSERT INTO users (id, username, email, password, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(user.id, user.username, user.email, user.password, user.createdAt);
}

export function getUserById(userId: string) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

export function getProjectsWithTags(user_id): Project[] {
  const stmt = db.prepare(`
      SELECT
          p.id,
          p.title,
          p.user_id,
          GROUP_CONCAT(t.tag_name, ',') AS tags,
          p.is_favorite,
          p.created_at as createdAt,
          u.username
      FROM projects p
               LEFT JOIN project_tags pt ON p.id = pt.project_id
               LEFT JOIN tags t ON pt.tag_id = t.id
               LEFT JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?
      GROUP BY p.id
  `);
  const result = stmt.all(user_id);
  console.log('result:', result);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.map((project: any) => {
    return { ...project, tags: project?.tags?.split(',') ?? [] };
  }) as Project[];
}

export function getProjectsById(id: string, userId: string): Project {
  const stmt = db.prepare(`
    SELECT p.id, p.title, p.user_id,
           GROUP_CONCAT(pt.tag_id, ', ') AS tags,
           p.is_favorite,
           p.created_at as createdAt,
           u.username
    FROM projects p
    LEFT JOIN project_tags pt ON p.id = pt.project_id
    LEFT JOIN users u ON u.id = p.user_id
    WHERE p.id = ? and p.user_id = ?
  `);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const result = stmt.get(id, userId) as any;
  console.log('result:', result);
  return {
    ...result,
    tags: result?.tags?.split(', ') ?? [],
  } as Project;
}

export function getAreasByProjectId(projectId: string) {
  const stmt = db.prepare(`
    SELECT * FROM areas WHERE project_id = ?
  `);
  const result = stmt.all(projectId);
  return result as Area[];
}

export function getTasksByProjectId(projectId: string) {
  const stmt = db.prepare(`
    SELECT t.*
    FROM tasks t
    JOIN areas a ON t.area_id = a.id
    WHERE a.project_id = ?
  `);
  const result = stmt.all(projectId);
  return result as Task[];
}

export function getProjectDataByProjectId(projectId: string, userId: string) {
  const project = getProjectsById(projectId, userId);
  if (project.id === null) {
    return null;
  }
  const stmt = db.prepare(`
      SELECT
          a.id as area_id,
          a.title as area_title,
          t.task_id,
          t.text,
          t.task_owner, 
          t.created_at,
          GROUP_CONCAT(tt.tag_id, ', ') as tags
      FROM areas a
               LEFT JOIN tasks t ON a.id = t.area_id
               LEFT JOIN task_tags tt ON t.task_id = tt.task_id
      WHERE a.project_id = ?
      GROUP BY a.id, a.title, t.task_id, t.text, t.task_owner, t.created_at;
    `);
  const records = stmt.all(projectId);

  const areasMap = new Map<string, Area>();

  records.forEach((record: any) => {
    if (areasMap.has(record.area_id)) {
      areasMap.get(record.area_id)?.tasks.push({
        taskId: record.task_id,
        text: record.text,
        tags: record.tags?.split(', ') ?? [],
        taskOwner: record.task_owner,
        createdAt: record.created_at,
      });
    } else {
      areasMap.set(record.area_id, {
        id: record.area_id,
        title: record.area_title,
        tasks: record.task_id
          ? [
              {
                taskId: record.task_id,
                text: record.text,
                tags: record.tags?.split(', ') ?? [],
                taskOwner: record.task_owner,
                createdAt: record.created_at,
              },
            ]
          : [],
      });
    }
  });

  project.areas = [...areasMap.values()] as Area[];

  return project;
}

export function addNewTask(project_id: string, area_id: string, task: Task) {
  const stmt =
    db.prepare(`INSERT INTO tasks (task_id, text, task_owner, created_at, project_id, area_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    task.taskId,
    task.text,
    task.taskOwner,
    task.createdAt,
    project_id,
    area_id
  );
}

export function updateTask(task: Task) {
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

export function addNewProject(data: Project) {
  db.transaction(() => {
    db.prepare(
      `INSERT INTO projects (id, title, user_id, is_favorite, created_at)
       VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`
    ).run(data.id, data.title, data.userId, data.isFavorite ? 1 : 0);

    if (data.tags?.length) {
      const userTags =
        (db
          .prepare('SELECT tag_name, id FROM tags WHERE user_id = ?')
          .all(data.userId) as Array<{ tag_name: string; id: string }>) || [];

      const newTags = data.tags.filter((tag) => {
        const userTag = userTags.find((t) => t.tag_name === tag);

        if (userTag) {
          return false;
        }

        return true;
      });

      console.log('newTags:', newTags);

      newTags.forEach((tagName) => {
        const tagId = crypto.randomUUID();
        const result = db
          .prepare(`INSERT INTO tags (id, user_id, tag_name) VALUES (?, ?, ?)`)
          .run(tagId, data.userId, tagName);
        console.log('insert result:', result);
      });

      const userTags2 =
        (db
          .prepare('SELECT tag_name, id FROM tags WHERE user_id = ?')
          .all(data.userId) as Array<{ tag_name: string; id: string }>) || [];

      console.log('userTags2:', userTags2);
      const tagIds = data.tags.map((tag) => {
        const userTag = userTags2.find((t) => {
          return t.tag_name === tag;
        });

        if (!userTag) {
          throw new Error(`Can't find tag '${tag}' in user tags`);
        }

        return userTag.id;
      });

      const placeholders = tagIds.map(() => '(?, ?)').join(',');
      const flatValues = tagIds.flatMap((tagId) => [data.id, tagId]);

      console.log('placeholders ->>>', flatValues);

      db.prepare(
        `INSERT INTO project_tags (project_id, tag_id) VALUES ${placeholders}`
      ).run(...flatValues);
    }
  })();
}

export function deleteProject(projectId: string) {
  const stmt = db.prepare(`DELETE FROM projects WHERE id = ?`);
  stmt.run(projectId);
}

export function updateProject(data) {
  db.transaction(() => {
    db.prepare(
      `UPDATE projects 
       SET title = ?, is_favorite = ? 
       WHERE id = ?`
    ).run(data.title, data.isFavorite ? 1 : 0, data.id);

    db.prepare(`DELETE FROM project_tags WHERE project_id = ?`).run(data.id);

    if (data.tags?.length) {
      const { user_id: userId } = db
        .prepare(`SELECT user_id FROM projects WHERE id = ?`)
        .get(data.id) as { user_id: string };

      if (!userId) {
        throw new Error('Проект не найден');
      }

      data.tags.forEach((tagName:string) => {
        console.log('Начинаю проверять ТАГ: ', tagName);
        let { id: tagId } = (db
          .prepare(`SELECT id FROM tags WHERE user_id = ? AND tag_name = ?`)
          .get(userId, tagName) as { id: string }) || { id : '' }               //ИСПРАВИТЬ!!!

        if (!tagId) {
          console.log(tagName, 'не найден, создаю!');
          tagId = crypto.randomUUID();
          db.prepare(
            `INSERT INTO tags (id, user_id, tag_name) VALUES (?, ?, ?)`
          ).run(tagId, userId, tagName);
        }
        console.log(tagName, '-> ', tagId);
        db.prepare(
          `INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)`
        ).run(data.id, tagId);
      });
    }
  })();
}
