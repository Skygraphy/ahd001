export const prerender = false;

import { getDb } from '$lib/server/db.js';
import { products, productImages, settings } from '$lib/server/schema.js';
import { eq, asc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

const DEFAULT_TEMPLATE = 'Ich interessiere mich für das Objekt {Name}. Bitte kontaktieren Sie mich unter meiner angegebenen E-Mail-Adresse.';

export async function load({ params }) {
  const id = parseInt(params.id, 10);
  if (!id || isNaN(id)) error(404, 'Produkt nicht gefunden');

  const db = getDb(env.DATABASE_URL);

  const [[product], images, [templateRow]] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)),
    db.select().from(productImages).where(eq(productImages.product_id, id)).orderBy(asc(productImages.sort_order)),
    db.select().from(settings).where(eq(settings.key, 'inquiry_template')),
  ]);

  if (!product || !product.visible) error(404, 'Produkt nicht gefunden');

  return {
    product: { ...product, images },
    inquiryTemplate: templateRow?.value ?? DEFAULT_TEMPLATE,
  };
}
