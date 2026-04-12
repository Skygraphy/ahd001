import { fail, redirect, error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { products, productImages } from '$lib/server/schema.js';
import { eq, asc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export async function load({ params }) {
  const id = parseInt(params.id, 10);
  if (!id || isNaN(id)) error(404, 'Produkt nicht gefunden');

  const db = getDb(env.DATABASE_URL);

  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) error(404, 'Produkt nicht gefunden');

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.product_id, id))
    .orderBy(asc(productImages.sort_order));

  return { product, images };
}

export const actions = {
  update: async ({ request, params }) => {
    const id = parseInt(params.id, 10);
    const data = await request.formData();

    const name        = data.get('name')?.toString().trim() ?? '';
    const description = data.get('description')?.toString().trim() ?? '';
    const priceEuros  = parseFloat(data.get('price')?.toString() ?? '0');
    const type        = data.get('type')?.toString().trim() ?? '';
    const sort_order  = parseInt(data.get('sort_order')?.toString() ?? '0');
    const visible     = data.get('visible') === 'on';

    if (!name)        return fail(400, { error: 'Name ist erforderlich.' });
    if (!description) return fail(400, { error: 'Beschreibung ist erforderlich.' });
    if (!type)        return fail(400, { error: 'Typ ist erforderlich.' });
    if (isNaN(priceEuros) || priceEuros <= 0) {
      return fail(400, { error: 'Ungültiger Preis.' });
    }

    const db = getDb(env.DATABASE_URL);
    await db.update(products).set({
      name,
      description,
      price_cents: Math.round(priceEuros * 100),
      type,
      sort_order: isNaN(sort_order) ? 0 : sort_order,
      visible,
    }).where(eq(products.id, id));

    return { success: true };
  },

  addImage: async ({ request, params }) => {
    const id = parseInt(params.id, 10);
    const data = await request.formData();

    const url        = data.get('url')?.toString().trim() ?? '';
    const alt        = data.get('alt')?.toString().trim() ?? '';
    const sort_order = parseInt(data.get('sort_order')?.toString() ?? '0');

    if (!url) return fail(400, { imageError: 'URL ist erforderlich.' });

    const db = getDb(env.DATABASE_URL);
    await db.insert(productImages).values({
      product_id: id,
      url,
      alt,
      sort_order: isNaN(sort_order) ? 0 : sort_order,
    });
  },

  deleteImage: async ({ request }) => {
    const data = await request.formData();
    const imageId = parseInt(data.get('imageId')?.toString() ?? '');

    if (!imageId) return fail(400, { error: 'Ungültige Bild-ID' });

    const db = getDb(env.DATABASE_URL);
    await db.delete(productImages).where(eq(productImages.id, imageId));
  },

  reorderImages: async ({ request }) => {
    const data = await request.formData();
    const ids = data.getAll('ids').map(Number).filter(Boolean);

    const db = getDb(env.DATABASE_URL);
    await Promise.all(
      ids.map((id, idx) =>
        db.update(productImages).set({ sort_order: idx }).where(eq(productImages.id, id))
      )
    );
  },

  deleteProduct: async ({ params }) => {
    const id = parseInt(params.id, 10);
    const db = getDb(env.DATABASE_URL);
    await db.delete(products).where(eq(products.id, id));
    redirect(303, '/admin');
  },
};
