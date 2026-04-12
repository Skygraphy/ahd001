import { getDb } from '$lib/server/db.js';
import { products } from '$lib/server/schema.js';
import { asc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load() {
  const db = getDb(env.DATABASE_URL);
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sort_order));
  return { products: rows };
}

export const actions = {
  toggleVisible: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id')?.toString() ?? '');
    const visible = data.get('visible') === 'true';

    if (!id) return fail(400, { error: 'Ungültige ID' });

    const db = getDb(env.DATABASE_URL);
    await db.update(products).set({ visible: !visible }).where(eq(products.id, id));
  },

  delete: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get('id')?.toString() ?? '');

    if (!id) return fail(400, { error: 'Ungültige ID' });

    const db = getDb(env.DATABASE_URL);
    await db.delete(products).where(eq(products.id, id));
  },
};
