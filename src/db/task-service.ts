import db from './init-db.mjs'
// import { Task } from '@/types/task'
import { User } from '@/types/users'
import { Project } from '@/types/project'
import { Area } from '@/types/area'
import { Task } from '@/types/task'

export function createUser(user: User) {
  const stmt = db.prepare(`
    INSERT INTO users (id, username, email, password, created_at)
    VALUES (?, ?, ?, ?, ?)
  `)
  stmt.run(user.id, user.username, user.email, user.password, user.createdAt)
}

export function getUserById(userId: string) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
}

export function getProjectsWithTags(): Project[] {
  const stmt = db.prepare(`
    SELECT p.id, p.title, p.owner, 
           GROUP_CONCAT(pt.tag, ', ') AS tags, 
           p.is_favorite, 
           p.created_at as createdAt
    FROM projects p
    LEFT JOIN project_tags pt ON p.id = pt.project_id
    GROUP BY p.id
  `)
  const result = stmt.all()
  return result as Project[]
}

export function getProjectsById(id: string): Project {
  const stmt = db.prepare(`
    SELECT p.id, p.title, p.owner,
           GROUP_CONCAT(pt.tag, ', ') AS tags,
           p.is_favorite,
           p.created_at as createdAt
    FROM projects p
    LEFT JOIN project_tags pt ON p.id = pt.project_id
    WHERE p.id = ?
  `)
  const result = stmt.get(id) as any
  return {
    ...result,
    tags: result?.tags?.split(', ') ?? [],
  } as Project
}

export function getAreasByProjectId(projectId: string) {
  const stmt = db.prepare(`
    SELECT * FROM areas WHERE project_id = ?
  `)
  const result = stmt.all(projectId)
  return result as Area[]
}

export function getTasksByProjectId(projectId: string) {
  const stmt = db.prepare(`
    SELECT t.* 
    FROM tasks t
    JOIN areas a ON t.area_id = a.id
    WHERE a.project_id = ?
  `)
  const result = stmt.all(projectId)
  return result as Task[]
}

export function getProjectDataByProjectId(projectId: string) {
  const project = getProjectsById(projectId)
  if (project.id === null) {
    return null
  }
  const stmt = db.prepare(`
      SELECT
          a.id as area_id,
          a.title as area_title,
          t.task_id,
          t.text,
          t.task_owner,
          t.created_at,
          GROUP_CONCAT(tt.tag, ', ') as tags
      FROM areas a
               LEFT JOIN tasks t ON a.id = t.area_id
               LEFT JOIN task_tags tt ON t.task_id = tt.task_id
      WHERE a.project_id = ?
      GROUP BY a.id, a.title, t.task_id, t.text, t.task_owner, t.created_at;
    `)
  const records = stmt.all(projectId)

  const areasMap = new Map<string, Area>()

  records.forEach((record: any) => {
    if (areasMap.has(record.area_id)) {
      areasMap.get(record.area_id)?.tasks.push({
        taskId: record.task_id,
        text: record.text,
        tags: record.tags?.split(', ') ?? [],
        taskOwner: record.task_owner,
        createdAt: record.created_at,
      })
    } else {
      areasMap.set(record.area_id, {
        id: record.area_id,
        title: record.area_title,
        tasks: [
          {
            taskId: record.task_id,
            text: record.text,
            tags: record.tags?.split(', ') ?? [],
            taskOwner: record.task_owner,
            createdAt: record.created_at,
          },
        ],
      })
    }
  })

  project.areas = [...areasMap.values()] as Area[]

  return project
}

export function addNewTask(project_id: string, area_id: string, task: Task) {
const stmt =
  db.prepare(`INSERT INTO tasks (task_id, text, task_owner, created_at, project_id, area_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
stmt.run(task.task_id,task.
}