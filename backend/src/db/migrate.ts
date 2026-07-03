import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pool } from './pool';

async function migrate() {
  const sql = readFileSync(join(__dirname, '../../db/schema.sql'), 'utf8');
  await pool.query(sql);
  await pool.end();
  console.log('Database migration completed');
}

migrate().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
