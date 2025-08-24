import Database from 'better-sqlite3';
import { resolve } from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const dbPath = resolve(process.env.DB_PATH);

console.log('ENV', process.env);
console.log('dbPath ->> ', dbPath);

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

function getRandomDate() {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

// Чистим все таблицы
const tables = [
  'user_sessions',
  'project_users',
  'project_tags',
  'task_tags',
  'tasks',
  'areas',
  'projects',
  'tags',
  'users',
  'roles',
];
tables.forEach((table) => db.exec(`DELETE FROM ${table};`));

// Добавляем роли
const roles = [
  { id: '1', name: 'SUPER_USER' },
  { id: '2', name: 'OWNER' },
  { id: '3', name: 'MODERATOR' },
  { id: '4', name: 'MEMBER' },
  { id: '5', name: 'VIEWER' },
];
const insertRole = db.prepare(
  'INSERT INTO roles (id, role_name) VALUES (?, ?)'
);
roles.forEach((r) => insertRole.run(r.id, r.name));

// Пользователи
const users = [
  { username: 'admin', email: 'admin@example.com', is_superuser: 1 },
  { username: 'alice', email: 'alice@example.com', is_superuser: 0 },
  { username: 'bob', email: 'bob@example.com', is_superuser: 0 },
  { username: 'charlie', email: 'charlie@example.com', is_superuser: 0 },
  { username: 'diana', email: 'diana@example.com', is_superuser: 0 },
];

const userIds = {};
const insertUser = db.prepare(`
  INSERT INTO users (id, username, email, password, created_at, is_superuser)
  VALUES (?, ?, ?, ?, ?, ?)
`);
users.forEach((u) => {
  const id = uuidv4();
  userIds[u.username] = id;
  insertUser.run(
    id,
    u.username,
    u.email,
    '123',
    getRandomDate(),
    u.is_superuser
  );
});

// Statements
const insertProject = db.prepare(`
  INSERT INTO projects (id, title, user_id, is_favorite, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

const insertArea = db.prepare(`
  INSERT INTO areas (id, title, project_id)
  VALUES (?, ?, ?)
`);

const insertProjectUser = db.prepare(`
  INSERT INTO project_users (project_id, user_id, role_id)
  VALUES (?, ?, ?)
`);

const insertTask = db.prepare(`
  INSERT INTO tasks (task_id, text, task_owner, created_at, area_id)
  VALUES (?, ?, ?, ?, ?)
`);

const insertTag = db.prepare(`
  INSERT INTO tags (id, user_id, tag_name)
  VALUES (?, ?, ?)
`);

const insertProjectTag = db.prepare(`
  INSERT INTO project_tags (project_id, tag_id)
  VALUES (?, ?)
`);

const insertTaskTag = db.prepare(`
  INSERT INTO task_tags (task_id, tag_id)
  VALUES (?, ?)
`);

const insertSession = db.prepare(`
  INSERT INTO user_sessions (id, user_id, created_at)
  VALUES (?, ?, ?)
`);

Object.entries(userIds).forEach(([username, userId]) => {
  const projectCount = Math.floor(Math.random() * 6) + 1; // от 1 до 6 проектов

  for (let i = 1; i <= projectCount; i++) {
    const projectId = uuidv4();
    insertProject.run(
      projectId,
      `${username}'s Project ${i}`,
      userId,
      i === 1 ? 1 : 0,
      getRandomDate()
    );
    insertProjectUser.run(projectId, userId, '2'); // OWNER

    const otherUsers = Object.values(userIds).filter((id) => id !== userId);
    const shuffled = otherUsers.sort(() => Math.random() - 0.5).slice(0, 2);
    shuffled.forEach((memberId, idx) => {
      const role = idx === 0 ? '3' : '4'; // MODERATOR или MEMBER
      insertProjectUser.run(projectId, memberId, role);
    });

    const areaCount = Math.floor(Math.random() * 3) + 1;
    const areaIds = [];
    for (let a = 1; a <= areaCount; a++) {
      const areaId = uuidv4();
      areaIds.push(areaId);
      insertArea.run(
        areaId,
        `Area ${a} of ${username}'s Project ${i}`,
        projectId
      );

      const taskCount = Math.floor(Math.random() * 3) + 1;
      for (let t = 1; t <= taskCount; t++) {
        const taskId = uuidv4();
        insertTask.run(
          taskId,
          `Task ${t} in Area ${a}`,
          userId,
          getRandomDate(),
          areaId
        );

        if (Math.random() > 0.5) {
          const tagId = uuidv4();
          console.log('Таска -> ', `${username}_tag_${t}`);
          insertTag.run(tagId, userId, `${username}_tag_${t}`);
          insertTaskTag.run(taskId, tagId);
        }
      }
    }

    if (Math.random() > 0.5) {
      const tagId = uuidv4();
      insertTag.run(tagId, userId, `${username}_project_tag_${i}`);
      insertProjectTag.run(projectId, tagId);
    }
  }
});

Object.values(userIds).forEach((userId) => {
  if (Math.random() > 0.3) {
    insertSession.run(uuidv4(), userId, getRandomDate());
  }
});

console.log('Database successfully populated with full mock data.');
export default db;
