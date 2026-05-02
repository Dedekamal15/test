import pool from '../server/config/db.js';
import bcrypt from 'bcryptjs';

async function verifyAdmin() {
  try {
    const [rows] = await pool.execute('SELECT username, password FROM users WHERE username IN ("admin", "guru1", "siswa1")');
    for (const row of rows) {
      let plaintext = '';
      if (row.username === 'admin') plaintext = 'Admin123!';
      else if (row.username === 'guru1') plaintext = 'Guru123!';
      else if (row.username === 'siswa1') plaintext = 'Siswa123!';

      const valid = await bcrypt.compare(plaintext, row.password);
      console.log(`Password "${plaintext}" valid for ${row.username}:`, valid);
    }
    await pool.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

verifyAdmin();
