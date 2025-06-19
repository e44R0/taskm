import { User } from '@/types/users';
import db from './init-db.mjs';
import { Session } from '@/types/session';

//export function getUserByName(name: string) {
//  return db.prepare('SELECT * FROM users WHERE username = ?').get(name) as User;
// }

export function getUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User;
}

export function createSession(usedId: string, uuid: string) {
  const stmt = db.prepare(`INSERT INTO user_sessions (id, user_id, created_at)
    VALUES (?, ?, datetime('now', 'localtime'))
  `);
  stmt.run(uuid, usedId);
}

export function getSession(id: string): Session {
  const session = db
    .prepare(
      `SELECT us.id, us.user_id, us.created_at, u.username FROM user_sessions us 
      LEFT JOIN users u ON us.user_id = u.id 
      WHERE us.id = ?`
    )
    .get(id) as {
    id: string;
    user_id: string;
    created_at: string;
    username: string;
  };

  return {
    id: session.id,
    userId: session['user_id'],
    createdAt: new Date(session['created_at']),
    username: session.username,
  };
}

export function deleteSession(id: string) {
  const stmt = db.prepare(`DELETE FROM user_sessions WHERE id = ?`);
  stmt.run(id);
}

export function createUser(
  usedId: string,
  username: string,
  password: string,
  email: string
) {
  const stmt =
    db.prepare(`INSERT INTO users (id, username, email, password, created_at)
    VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
  `);
  stmt.run(usedId, username, email, password);
}
