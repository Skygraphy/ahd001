import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

let _db;

export function getDb(databaseUrl) {
  if (!_db) {
    if (!databaseUrl) throw new Error('DATABASE_URL ist nicht gesetzt');
    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
  }
  return _db;
}
