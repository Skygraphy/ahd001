export const prerender = false;

import { getDb } from '$lib/server/db.js';
import { products, productImages } from '$lib/server/schema.js';
import { eq, asc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { productDetails } from '$lib/data/product-details.js';

export async function load({ params }) {
  const id = parseInt(params.id, 10);
  if (!id || isNaN(id)) error(404, 'Produkt nicht gefunden');

  const db = getDb(env.DATABASE_URL);

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id));

  if (!product || !product.visible) error(404, 'Produkt nicht gefunden');

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.product_id, id))
    .orderBy(asc(productImages.sort_order));

  const details = productDetails[id] ?? null;

  return { product: { ...product, images }, details };
}
