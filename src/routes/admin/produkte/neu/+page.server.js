import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { products } from '$lib/server/schema.js';
import { env } from '$env/dynamic/private';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const name        = data.get('name')?.toString().trim() ?? '';
    const description = data.get('description')?.toString().trim() ?? '';
    const priceEuros  = parseFloat(data.get('price')?.toString() ?? '0');
    const type        = data.get('type')?.toString().trim() ?? '';
    const sort_order  = parseInt(data.get('sort_order')?.toString() ?? '0');
    const visible     = data.get('visible') === 'on';

    if (!name)        return fail(400, { error: 'Name ist erforderlich.', values: Object.fromEntries(data) });
    if (!description) return fail(400, { error: 'Beschreibung ist erforderlich.', values: Object.fromEntries(data) });
    if (!type)        return fail(400, { error: 'Typ ist erforderlich.', values: Object.fromEntries(data) });
    if (isNaN(priceEuros) || priceEuros <= 0) {
      return fail(400, { error: 'Ungültiger Preis.', values: Object.fromEntries(data) });
    }

    const price_cents = Math.round(priceEuros * 100);

    const db = getDb(env.DATABASE_URL);
    const [inserted] = await db.insert(products).values({
      name,
      description,
      price_cents,
      type,
      sort_order: isNaN(sort_order) ? 0 : sort_order,
      visible,
    }).returning({ id: products.id });

    redirect(303, `/admin/produkte/${inserted.id}`);
  },
};
