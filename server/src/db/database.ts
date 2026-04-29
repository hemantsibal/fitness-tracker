import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = process.env.DATABASE_PATH || './nutrition-tracker.sqlite';
const schemaPath = path.resolve('src/db/schema.sql');
export const db = new Database(dbPath);

export function initDb() {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
}
