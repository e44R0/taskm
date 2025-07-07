import Database from 'better-sqlite3';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = resolve(process.env.DB_PATH);
const db = new Database(dbPath);

// function generateId(prefix) {
//   return `${prefix}_${Math.random().toString(36).substr(2, 5)}`;
// }

function getRandomDate() {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

db.exec(`
  DELETE FROM user_sessions;
  DELETE FROM project_users;
  DELETE FROM project_tags;
  DELETE FROM task_tags;
  DELETE FROM tasks;
  DELETE FROM areas;
  DELETE FROM projects;
  DELETE FROM users;
`);

// Insert mock users
const users = [
  {
    id: 'user_1',
    username: 'john_doe',
    email: 'john@example.com',
    password: '123',
    created_at: getRandomDate(),
  },
  {
    id: 'user_2',
    username: 'jane_smith',
    email: 'jane@example.com',
    password: '123',
    created_at: getRandomDate(),
  },
  {
    id: 'user_3',
    username: 'mike_johnson',
    email: 'mike@example.com',
    password: '123',
    created_at: getRandomDate(),
  },
];

const insertUser = db.prepare(
  'INSERT INTO users (id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)'
);
users.forEach((user) =>
  insertUser.run(
    user.id,
    user.username,
    user.email,
    user.password,
    user.created_at
  )
);

// Insert mock projects
const projects = [
  {
    id: 'project_1',
    title: 'Company Website',
    user_id: 'user_1',
    is_favorite: 1,
    created_at: getRandomDate(),
  },
  {
    id: 'project_2',
    title: 'Mobile App',
    user_id: 'user_2',
    is_favorite: 0,
    created_at: getRandomDate(),
  },
  {
    id: 'project_3',
    title: 'Internal Dashboard',
    user_id: 'user_1',
    is_favorite: 1,
    created_at: getRandomDate(),
  },
  {
    id: 'project_4',
    title: 'Marketing Campaign',
    user_id: 'user_3',
    is_favorite: 0,
    created_at: getRandomDate(),
  },
];

const insertProject = db.prepare(
  'INSERT INTO projects (id, title, user_id, is_favorite, created_at) VALUES (?, ?, ?, ?, ?)'
);
projects.forEach((project) =>
  insertProject.run(
    project.id,
    project.title,
    project.user_id,
    project.is_favorite,
    project.created_at
  )
);

// Insert project members
const projectUsers = [
  { project_id: 'project_1', user_id: 'user_1', role: 'owner' },
  { project_id: 'project_1', user_id: 'user_2', role: 'member' },
  { project_id: 'project_2', user_id: 'user_2', role: 'owner' },
  { project_id: 'project_2', user_id: 'user_3', role: 'member' },
  { project_id: 'project_3', user_id: 'user_1', role: 'owner' },
  { project_id: 'project_3', user_id: 'user_3', role: 'admin' },
  { project_id: 'project_4', user_id: 'user_3', role: 'owner' },
];

const insertProjectUser = db.prepare(
  'INSERT INTO project_users (project_id, user_id, role) VALUES (?, ?, ?)'
);
projectUsers.forEach((pu) =>
  insertProjectUser.run(pu.project_id, pu.user_id, pu.role)
);

// Insert project tags
const projectTags = [
  { project_id: 'project_1', tag: 'web' },
  { project_id: 'project_1', tag: 'design' },
  { project_id: 'project_2', tag: 'mobile' },
  { project_id: 'project_2', tag: 'development' },
  { project_id: 'project_3', tag: 'internal' },
  { project_id: 'project_4', tag: 'marketing' },
];

const insertProjectTag = db.prepare(
  'INSERT INTO project_tags (project_id, tag) VALUES (?, ?)'
);
projectTags.forEach((pt) => insertProjectTag.run(pt.project_id, pt.tag));

// Insert project areas
const areas = [
  { id: 'area_1', title: 'Frontend', project_id: 'project_1' },
  { id: 'area_2', title: 'Backend', project_id: 'project_1' },
  { id: 'area_3', title: 'Design', project_id: 'project_1' },
  { id: 'area_4', title: 'iOS', project_id: 'project_2' },
  { id: 'area_5', title: 'Android', project_id: 'project_2' },
  { id: 'area_6', title: 'API', project_id: 'project_3' },
  { id: 'area_7', title: 'Database', project_id: 'project_3' },
  { id: 'area_8', title: 'Content', project_id: 'project_4' },
];

const insertArea = db.prepare(
  'INSERT INTO areas (id, title, project_id) VALUES (?, ?, ?)'
);
areas.forEach((area) => insertArea.run(area.id, area.title, area.project_id));

// Insert tasks
const tasks = [
  {
    task_id: 'task_1',
    text: 'Create homepage layout',
    task_owner: 'user_1',
    created_at: getRandomDate(),
    project_id: 'project_1',
    area_id: 'area_1',
  },
  {
    task_id: 'task_2',
    text: 'Implement auth API',
    task_owner: 'user_2',
    created_at: getRandomDate(),
    project_id: 'project_1',
    area_id: 'area_2',
  },
  {
    task_id: 'task_3',
    text: 'Design logo',
    task_owner: 'user_3',
    created_at: getRandomDate(),
    project_id: 'project_1',
    area_id: 'area_3',
  },
  {
    task_id: 'task_4',
    text: 'Develop login screen',
    task_owner: 'user_2',
    created_at: getRandomDate(),
    project_id: 'project_2',
    area_id: 'area_4',
  },
  {
    task_id: 'task_5',
    text: 'Integrate payments',
    task_owner: 'user_3',
    created_at: getRandomDate(),
    project_id: 'project_2',
    area_id: 'area_5',
  },
  {
    task_id: 'task_6',
    text: 'Optimize DB queries',
    task_owner: 'user_1',
    created_at: getRandomDate(),
    project_id: 'project_3',
    area_id: 'area_7',
  },
  {
    task_id: 'task_7',
    text: 'Create content plan',
    task_owner: 'user_3',
    created_at: getRandomDate(),
    project_id: 'project_4',
    area_id: 'area_8',
  },
];

const insertTask = db.prepare(
  'INSERT INTO tasks (task_id, text, task_owner, created_at, project_id, area_id) VALUES (?, ?, ?, ?, ?, ?)'
);
tasks.forEach((task) =>
  insertTask.run(
    task.task_id,
    task.text,
    task.task_owner,
    task.created_at,
    task.project_id,
    task.area_id
  )
);

// Insert task tags
const taskTags = [
  { task_id: 'task_1', tag: 'urgent' },
  { task_id: 'task_1', tag: 'important' },
  { task_id: 'task_2', tag: 'development' },
  { task_id: 'task_3', tag: 'design' },
  { task_id: 'task_4', tag: 'mobile' },
  { task_id: 'task_5', tag: 'integration' },
  { task_id: 'task_6', tag: 'optimization' },
  { task_id: 'task_7', tag: 'content' },
];

const insertTaskTag = db.prepare(
  'INSERT INTO task_tags (task_id, tag) VALUES (?, ?)'
);
taskTags.forEach((tt) => insertTaskTag.run(tt.task_id, tt.tag));

// Insert user sessions
const userSessions = [
  {
    id: 'session_1',
    user_id: 'user_1',
    created_at: getRandomDate(),
  },
  {
    id: 'session_2',
    user_id: 'user_2',
    created_at: getRandomDate(),
  },
  {
    id: 'session_3',
    user_id: 'user_3',
    created_at: getRandomDate(),
  },
];

const insertUserSession = db.prepare(
  'INSERT INTO user_sessions (id, user_id, created_at) VALUES (?, ?, ?)'
);
userSessions.forEach((us) =>
  insertUserSession.run(us.id, us.user_id, us.created_at)
);

console.log('Database successfully populated with mock data.');

export default db;
