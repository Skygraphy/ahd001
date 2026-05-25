import { getDb } from '$lib/server/db.js';
import { settings } from '$lib/server/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  const path = event.url.pathname;

  if (path.startsWith('/admin')) {
    // Login und Logout brauchen keine Authentifizierung
    if (path === '/admin/login' || path.startsWith('/admin/logout')) {
      return resolve(event);
    }

    const isAuth = event.cookies.get('admin_session') === env.ADMIN_PASSWORD;
    if (!isAuth) {
      // POST-Requests (Actions) ohne Session → 403
      if (event.request.method !== 'GET') {
        return new Response('Forbidden', { status: 403 });
      }
      throw redirect(303, '/admin/login');
    }

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
    if (err?.status && err?.location) throw err;
  }

  return resolve(event);
}
