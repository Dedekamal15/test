/**
 * Seed Script — Create default users for development
 * Usage: node server/scripts/seed.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

import pool from '../config/db.js';
import { initUsersTable, createUser, findUserByUsername, updateUserForSeed } from '../models/User.js';

const defaultUsers = [
  { username: 'admin',   password: 'Admin123!',  kelas: null,  role: 'admin' },
  { username: 'guru1',   password: 'Guru123!',   kelas: null,  role: 'guru'  },
  { username: 'siswa1',  password: 'Siswa123!',  kelas: '10',  role: 'siswa' },
  { username: 'siswa2',  password: 'Siswa123!',  kelas: '11',  role: 'siswa' },
];

async function seed() {
  console.log('🌱 Starting seed...\n');
  await initUsersTable();

  for (const u of defaultUsers) {
    const existing = await findUserByUsername(u.username);
    if (existing) {
      await updateUserForSeed(existing.id, u);
      console.log(`  🔄  Updated user "${u.username}" (ensured password & role)`);
    } else {
      const id = await createUser(u);
      console.log(`  ✅  Created user "${u.username}" (id=${id}, role=${u.role})`);
    }
  }

  console.log('\n✅ Seed complete');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
