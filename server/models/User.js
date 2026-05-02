import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// Initialize users table
export async function initUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      username    VARCHAR(100) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      kelas       VARCHAR(20),
      role        ENUM('siswa', 'guru', 'admin') NOT NULL DEFAULT 'siswa',
      is_active   TINYINT(1) NOT NULL DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await pool.execute(sql);
  console.log('✅ Table users ready');
}

export async function findUserByUsername(username) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE username = ? AND is_active = 1',
    [username]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute(
    'SELECT id, username, kelas, role, is_active, created_at FROM users WHERE id = ? AND is_active = 1',
    [id]
  );
  return rows[0] || null;
}

export async function createUser({ username, password, kelas, role = 'siswa' }) {
  const hashed = await bcrypt.hash(password, 12);
  const [result] = await pool.execute(
    'INSERT INTO users (username, password, kelas, role) VALUES (?, ?, ?, ?)',
    [username, hashed, kelas || null, role]
  );
  return result.insertId;
}

export async function verifyPassword(plaintext, hashed) {
  return bcrypt.compare(plaintext, hashed);
}

export async function updateUserPassword(id, newPassword) {
  const hashed = await bcrypt.hash(newPassword, 12);
  await pool.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashed, id]
  );
}

export async function updateUserForSeed(id, { password, role, kelas }) {
  const hashed = await bcrypt.hash(password, 12);
  await pool.execute(
    'UPDATE users SET password = ?, role = ?, kelas = ? WHERE id = ?',
    [hashed, role, kelas || null, id]
  );
}
