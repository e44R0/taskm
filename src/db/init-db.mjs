import Database from 'better-sqlite3';
import { resolve } from 'path';
// import dotenv from 'dotenv';
import 'dotenv/config';

// dotenv.config();
const dbPath = resolve(process.env.DB_PATH);

const db = new Database(dbPath, {
  // verbose: console.log,
});

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
                                         id TEXT PRIMARY KEY,
                                         username TEXT NOT NULL,
                                         email TEXT NOT NULL UNIQUE,
                                         password TEXT NOT NULL,
                                         created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
                                            id TEXT PRIMARY KEY,
                                            title TEXT NOT NULL,
                                            user_id TEXT NOT NULL,
                                            is_favorite BOOLEAN DEFAULT 0,
                                            created_at TEXT NOT NULL,
                                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS areas (
                                         id TEXT PRIMARY KEY,
                                         title TEXT NOT NULL,
                                         project_id TEXT NOT NULL,
                                         FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
                                         task_id TEXT PRIMARY KEY,
                                         text TEXT NOT NULL,
                                         task_owner TEXT NOT NULL,
                                         created_at TEXT NOT NULL,
                                         project_id TEXT NOT NULL,
                                         area_id TEXT,
                                         FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                                         FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_tags (
                                             task_id TEXT,
                                             tag TEXT,
                                             FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_tags (
                                                project_id TEXT,
                                                tag TEXT,
                                                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_users (
                                                 project_id TEXT NOT NULL,
                                                 user_id TEXT NOT NULL,
                                                 role TEXT NOT NULL,
                                                 FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                                                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                                 PRIMARY KEY (project_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
                                                 id TEXT PRIMARY KEY,
                                                 user_id TEXT NOT NULL,
                                                 created_at TEXT NOT NULL,
                                                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`);

/*
create table tags ... ( id NUMBER PRIMARY KEY, user_id, name)
table project_tags 
*/

console.log('База данных и таблицы успешно созданы.');

export default db;
