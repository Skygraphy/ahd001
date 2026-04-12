import { getDb } from '$lib/server/db.js';
import { settings } from '$lib/server/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export async function load() {
  const db = getDb(env.DATABASE_URL);
  const [row] = await db.select().from(settings).where(eq(settings.key, 'maintenance_mode'));
  return { maintenanceMode: row?.value === 'true' };
}

export const actions = {
  toggleMaintenance: async ({ request }) => {
    const data = await request.formData();
    const newValue = data.get('value') === 'true' ? 'true' : 'false';

    const db = getDb(env.DATABASE_URL);
    await db
      .insert(settings)
      .values({ key: 'maintenance_mode', value: newValue })
      .onConflictDoUpdate({ target: settings.key, set: { value: newValue } });

    return { success: true };
  },
};
