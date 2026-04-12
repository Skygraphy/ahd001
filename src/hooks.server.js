import { getDb } from '$lib/server/db.js';
import { settings } from '$lib/server/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  const path = event.url.pathname;

  // Admin immer durchlassen
  if (path.startsWith('/admin')) {
    return resolve(event);
  }

  try {
    const db = getDb(env.DATABASE_URL);
    const [row] = await db.select().from(settings).where(eq(settings.key, 'maintenance_mode'));
    const maintenance = row?.value === 'true';

    if (maintenance && !path.startsWith('/wartung')) {
      throw redirect(307, '/wartung');
    }
    if (!maintenance && path.startsWith('/wartung')) {
      throw redirect(307, '/');
    }
  } catch (err) {
    // SvelteKit-Redirects immer weiterwerfen
    if (err?.status && err?.location) throw err;
    // Bei echtem DB-Fehler normale Seite zeigen
  }

  return resolve(event);
}
