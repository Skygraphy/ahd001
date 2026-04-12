import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

await sql`CREATE TABLE IF NOT EXISTS settings (key text PRIMARY KEY NOT NULL, value text NOT NULL)`;
await sql`INSERT INTO settings (key, value) VALUES ('maintenance_mode', 'false') ON CONFLICT (key) DO NOTHING`;

console.log('✓ settings table ready');
