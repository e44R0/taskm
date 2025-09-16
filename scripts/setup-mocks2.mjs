import Database from 'better-sqlite3';
import { resolve } from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { randAdjective, randNoun, randTodo } from '@ngneat/falso';

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
const roles = {
  owner: { id: '1', name: 'OWNER' },
  moderator: { id: '2', name: 'MODERATOR' },
  member: { id: '3', name: 'MEMBER' },
  viewer: { id: '4', name: 'VIEWER' },
};
const areaTitles = ['TODO', 'IN PROGRESS', 'DONE'];

const insertRole = db.prepare(
  'INSERT INTO roles (id, role_name) VALUES (?, ?)'
);
Object.values(roles).forEach((r) => insertRole.run(r.id, r.name));

const bob = {
  id: '1',
  username: 'bob',
  email: 'bob@example.com',
  is_superuser: 0,
  createdAt: getRandomDate(),
  role: roles.owner,
};
// Пользователи
const users = [
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    is_superuser: 1,
    createdAt: getRandomDate(),
    role: roles.owner,
  },
  {
    id: '3',
    username: 'alice',
    email: 'alice@example.com',
    is_superuser: 0,
    createdAt: getRandomDate(),
    role: roles.member,
  },
  bob,
  {
    id: '4',
    username: 'charlie',
    email: 'charlie@example.com',
    is_superuser: 0,
    createdAt: getRandomDate(),
    role: roles.viewer,
  },
  {
    id: '5',
    username: 'diana',
    email: 'diana@example.com',
    is_superuser: 0,
    createdAt: getRandomDate(),
    role: roles.moderator,
  },
];

const insertUser = db.prepare(`
  INSERT INTO users (id, username, email, password, created_at, is_superuser)
  VALUES (?, ?, ?, ?, ?, ?)
`);
users.forEach((u) => {
  insertUser.run(u.id, u.username, u.email, '123', u.createdAt, u.is_superuser);
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

// const insertTag = db.prepare(`
//   INSERT INTO tags (id, user_id, tag_name)
//   VALUES (?, ?, ?)
// `);
//
// const insertProjectTag = db.prepare(`
//   INSERT INTO project_tags (project_id, tag_id)
//   VALUES (?, ?)
// `);
//
// const insertTaskTag = db.prepare(`
//   INSERT INTO task_tags (task_id, tag_id)
//   VALUES (?, ?)
// `);
//
// const insertSession = db.prepare(`
//   INSERT INTO user_sessions (id, user_id, created_at)
//   VALUES (?, ?, ?)
// `);

const createArea = (title) => {
  return {
    id: uuidv4(),
    title,
    tasks: randTodo({ length: 4 }),
  };
};

const createAreas = () => {
  return areaTitles.map((title) => createArea(title));
};

const createProject = (user) => {
  return {
    id: uuidv4(),
    title: `${randNoun()} ${randAdjective()}`,
    userId: user.id,
    isFavorite: 0,
    createdAt: getRandomDate(),
    areas: createAreas(),
  };
};

const createProjects = (user, count = 5) => {
  return Array(count)
    .fill(null)
    .map(() => createProject(user));
};

const projects = createProjects(bob);
const mainProject = projects[0];

projects.forEach((project) => {
  insertProject.run(
    project.id,
    project.title,
    project.userId,
    project.isFavorite,
    project.createdAt
  );

  project.areas.forEach((area) => {
    insertArea.run(area.id, area.title, project.id);

    area.tasks.forEach((task) => {
      insertTask.run(
        task.id,
        task.title,
        project.userId,
        getRandomDate(),
        area.id
      );
    });
  });
});

projects.forEach((project) => {
  insertProjectUser.run(project.id, project.userId, roles.owner.id);
});

users
  .filter((user) => user.username !== bob.username)
  .forEach(
    (user) => insertProjectUser.run(mainProject.id, user.id, user.role.id) // OWNER
  );

console.log('Database successfully populated with full mock data.');
export default db;
