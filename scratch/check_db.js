import pool from '../server/config/db.js';

async function checkUsers() {
  try {
    const [structure] = await pool.execute('DESCRIBE users');
    console.log('Users Table Structure:');
    console.table(structure);
    const [rows] = await pool.execute('SELECT id, username, role, is_active FROM users');
    console.log('Users in DB:');
    console.table(rows);
    await pool.end();
  } catch (err) {
    console.error('Error checking users:', err);
  }
}

checkUsers();
