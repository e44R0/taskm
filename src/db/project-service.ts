import db from '../../scripts/init-db.mjs';
import { DTO } from '@/types/transfer';
import { BE } from '@/types/backend';
import { getUserRole, isUserMatchRoles } from '@/db/user-service';
// import { DTO } from '@/types/transfer';

export const projectActionsRoles = {
  update: ['OWNER', 'MODERATOR'],
} as const;

export function getProjectsWithTags(userId: string): BE.Project[] {
  const stmt = db.prepare(`
    SELECT
      p.id,
      p.title,
      p.user_id as userId,
      p.created_at as createdAt,
      fp.is_favorite as isFavorite,
      r.role_name as roleName,
      u.username,
      GROUP_CONCAT(t.tag_name, ', ') AS tags
    FROM projects p
           JOIN project_users pu ON p.id = pu.project_id
           JOIN roles r ON pu.role_id = r.id
           LEFT JOIN project_tags pt ON p.id = pt.project_id
           LEFT JOIN tags t ON pt.tag_id = t.id
           LEFT JOIN users u ON u.id = p.user_id
           LEFT JOIN favorite_projects fp ON p.id = fp.project_id AND fp.user_id = ?
    WHERE pu.user_id = ?
    GROUP BY p.id, p.title, p.created_at, r.role_name;
  `);
  const result = stmt.all(userId, userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.map((project: any) => {
    return { ...project, tags: project?.tags?.split(',') ?? [] };
  }) as BE.Project[];
}

export function getProjectsById(id: string, userId: string): BE.Project {
  const stmt = db.prepare(`
    SELECT
      p.id,
      p.title,
      p.user_id as userId,
      p.created_at as createdAt,
      fp.is_favorite as isFavorite,
      r.role_name as roleName,
      u.username,
      GROUP_CONCAT(t.tag_name, ', ') AS tags
    FROM projects p
           JOIN project_users pu ON p.id = pu.project_id
           JOIN roles r ON pu.role_id = r.id
           LEFT JOIN project_tags pt ON p.id = pt.project_id
           LEFT JOIN tags t ON pt.tag_id = t.id
           LEFT JOIN users u ON u.id = p.user_id
           LEFT JOIN favorite_projects fp ON p.id = fp.project_id AND fp.user_id = ?
    WHERE p.id = ? AND pu.user_id = ?
    GROUP BY p.id, p.title, p.created_at, r.role_name;
  `);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const result = stmt.get(userId, id, userId) as any;

  return {
    ...result,
    tags: result?.tags?.split(', ') ?? [],
  } as BE.Project;
}

export function getProjectDataByProjectId(projectId: string, userId: string) {
  const project = getProjectsById(projectId, userId) as BE.ProjectWithAreas;
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

  const userRole = getUserRole(userId, projectId);

  const areasMap = new Map<string, BE.Area>();

  records.forEach((record: any) => {
    if (areasMap.has(record.area_id)) {
      areasMap.get(record.area_id)?.tasks.push({
        taskId: record.task_id,
        text: record.text,
        status: record.status,
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
                status: record.status,
                tags: record.tags?.split(', ') ?? [],
                taskOwner: record.task_owner,
                createdAt: record.created_at,
              },
            ]
          : [],
      });
    }
  });

  project.areas = [...areasMap.values()] as BE.Area[];
  project.userRole = userRole!;

  return project;
}

export function addNewProject(data: DTO.Project) {
  db.transaction(() => {
    db.prepare(
      `INSERT INTO projects (id, title, user_id, created_at)
       VALUES (?, ?, ?, datetime('now', 'localtime'))`
    ).run(data.id, data.title, data.userId);

    db.prepare(
      `INSERT INTO project_users (project_id, user_id, role_id)
       VALUES (?, ?, ?)`
    ).run(data.id, data.userId, '1');

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

export function updateProject(data: DTO.Project, userId: string) {
  const userRole = getUserRole(userId, data.id);
  console.log(userRole);

  if (!isUserMatchRoles(userRole, projectActionsRoles.update)) {
    return;
  }

  db.transaction(() => {
    db.prepare(
      `UPDATE projects 
       SET title = ?
       WHERE id = ?`
    ).run(data.title, data.id);

    db.prepare(`DELETE FROM project_tags WHERE project_id = ?`).run(data.id);

    if (data.tags?.length) {
      const { user_id: userId } = db
        .prepare(`SELECT user_id FROM projects WHERE id = ?`)
        .get(data.id) as { user_id: string };

      if (!userId) {
        throw new Error('Проект не найден');
      }

      data.tags.forEach((tagName: string) => {
        let { id: tagId } = (db
          .prepare(`SELECT id FROM tags WHERE user_id = ? AND tag_name = ?`)
          .get(userId, tagName) as { id: string }) || { id: '' }; //ИСПРАВИТЬ!!!

        if (!tagId) {
          tagId = crypto.randomUUID();
          db.prepare(
            `INSERT INTO tags (id, user_id, tag_name) VALUES (?, ?, ?)`
          ).run(tagId, userId, tagName);
        }

        db.prepare(
          `INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)`
        ).run(data.id, tagId);
      });
    }
  })();
}

export function toggleProjectFavorite(projectId: string, userId: string) {
  const existingRecord = db
    .prepare(
      `
    SELECT is_favorite as isFavorite FROM favorite_projects
    WHERE user_id = ? AND project_id = ?`
    )
    .get(userId, projectId) as { isFavorite: number } | undefined;

  if (existingRecord) {
    const newStatus = existingRecord.isFavorite !== 1;
    db.prepare(
      `UPDATE favorite_projects SET is_favorite = ?
       WHERE user_id = ? AND project_id = ?`
    ).run(newStatus ? 1 : 0, userId, projectId);
  } else {
    db.prepare(
      `INSERT INTO favorite_projects (user_id, project_id, is_favorite)
       VALUES (?, ?, ?)`
    ).run(userId, projectId, 1);
  }

  return getProjectsById(projectId, userId);
}
