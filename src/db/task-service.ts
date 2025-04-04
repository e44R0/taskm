import db from './init-db.mjs'
// import { Task } from '@/types/task'
import { User } from '@/types/users'

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
