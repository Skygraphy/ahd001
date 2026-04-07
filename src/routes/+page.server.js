import { db } from '$lib/server/db.js';
import { products } from '$lib/server/schema.js';
import { eq, asc } from 'drizzle-orm';

export async function load() {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.visible, true))
    .orderBy(asc(products.sort_order));

  return { products: rows };
}
