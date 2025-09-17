// init-db.mjs
import Database from 'better-sqlite3';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve('.env') });

if (!process.env.DB_PATH) {
  throw new Error('DB_PATH не определена в .env файле!');
}
console.log('DB_PATH=', process.env.DB_PATH);
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
                                         created_at TEXT NOT NULL,
                                         is_superuser BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS roles (
                                         id TEXT PRIMARY KEY,
                                         role_name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS projects (
                                            id TEXT PRIMARY KEY,
                                            title TEXT NOT NULL,
                                            user_id TEXT NOT NULL,
                                            created_at TEXT NOT NULL,
                                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_users (
                                                project_id TEXT NOT NULL,
                                                user_id TEXT NOT NULL,
                                                role_id TEXT NOT NULL,
                                                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                                FOREIGN KEY (role_id) REFERENCES roles(id),
                                                PRIMARY KEY (project_id, user_id)
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
                                         area_id TEXT NOT NULL,
                                         FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
    );

    



    CREATE TABLE IF NOT EXISTS user_sessions (
                                                 id TEXT PRIMARY KEY,
                                                 user_id TEXT NOT NULL,
                                                 created_at TEXT NOT NULL,
                                                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tags (
                                        id TEXT PRIMARY KEY,
                                        user_id TEXT NOT NULL,
                                        tag_name TEXT NOT NULL,
                                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                        UNIQUE(user_id, tag_name)
    );

    CREATE TABLE IF NOT EXISTS project_tags (
                                                project_id TEXT NOT NULL,
                                                tag_id TEXT NOT NULL,
                                                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                                                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
                                                PRIMARY KEY (project_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS task_tags (
                                            task_id TEXT NOT NULL,
                                            tag_id TEXT NOT NULL,
                                            FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
                                            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
                                            PRIMARY KEY (task_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS favorite_projects (
                                                   user_id TEXT NOT NULL,
                                                   project_id TEXT NOT NULL,
                                                   is_favorite BOOLEAN DEFAULT 0,
                                                   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                                   FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                                                   PRIMARY KEY (user_id, project_id)
    );

`);

console.log('База данных и таблицы успешно созданы.');

export default db;
