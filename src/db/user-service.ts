import db from '../../scripts/init-db.mjs';
import { BE } from '@/types/backend';
// import { DTO } from '@/types/transfer';

export function createUser(user: BE.User) {
  const stmt = db.prepare(`
    INSERT INTO users (id, username, email, password, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(user.id, user.username, user.email, user.password, user.createdAt);
}

export function getUserById(userId: string) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as BE.User;
}

export function getUserRole(userId: string, projectId: string) {
  const role = db
    .prepare(
      `SELECT r.role_name as roleName FROM project_users pu
            JOIN roles r on r.id = pu.role_id
            WHERE pu.user_id = ? AND pu.project_id = ?`
    )
    .get(userId, projectId) as { roleName: BE.Role } | undefined;

  return role?.roleName;
}

export function isUserMatchRoles(
  role: BE.Role | undefined,
  roles: readonly BE.Role[]
) {
  if (!role) {
    return false;
  }
  // getUserRole(userId, projectId)
  return roles.includes(role);
}
