import { fail, redirect, error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { products, productImages } from '$lib/server/schema.js';
import { eq, asc, desc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { v2 as cloudinary } from 'cloudinary';

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

    const nummer         = data.get('nummer')?.toString().trim() || null;
    const name           = data.get('name')?.toString().trim() ?? '';
    const description    = data.get('description')?.toString().trim() ?? '';
    const beschreibung   = data.get('beschreibung')?.toString().trim() || null;
    const besonderheiten = data.get('besonderheiten')?.toString().trim() || null;
    const materialien    = data.get('materialien')?.toString().trim() || null;
    const masse          = data.get('masse')?.toString().trim() || null;
    const priceEuros     = parseFloat(data.get('price')?.toString() ?? '0');
    const type           = data.get('type')?.toString().trim() ?? '';
    const sort_order     = parseInt(data.get('sort_order')?.toString() ?? '0');
    const visible        = data.get('visible') === 'on';

    if (!nummer)      return fail(400, { error: 'Nummer ist erforderlich.' });
    if (!name)        return fail(400, { error: 'Name ist erforderlich.' });
    if (!description) return fail(400, { error: 'Beschreibung ist erforderlich.' });
    if (!type)        return fail(400, { error: 'Typ ist erforderlich.' });
    if (isNaN(priceEuros) || priceEuros <= 0) {
      return fail(400, { error: 'Ungültiger Preis.' });
    }

    const db = getDb(env.DATABASE_URL);
    await db.update(products).set({
      nummer,
      name,
      description,
      beschreibung,
      besonderheiten,
      materialien,
      masse,
      price_cents: Math.round(priceEuros * 100),
      type,
      sort_order: isNaN(sort_order) ? 0 : sort_order,
      visible,
    }).where(eq(products.id, id));

    redirect(303, '/admin');
  },

  addImage: async ({ request, params }) => {
    const id = parseInt(params.id, 10);
    const data = await request.formData();

    const file = data.get('file');
    let   url  = data.get('url')?.toString().trim() ?? '';
    const alt  = data.get('alt')?.toString().trim() ?? '';

    const db = getDb(env.DATABASE_URL);
    const [last] = await db
      .select({ so: productImages.sort_order })
      .from(productImages)
      .where(eq(productImages.product_id, id))
      .orderBy(desc(productImages.sort_order))
      .limit(1);
    const sort_order = (last?.so ?? -1) + 1;

    if (file instanceof File && file.size > 0) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
      if (!allowed.includes(file.type)) {
        return fail(400, { imageError: 'Nur JPEG, PNG, WebP, GIF und AVIF sind erlaubt.' });
      }
      if (file.size > 10 * 1024 * 1024) {
        return fail(400, { imageError: 'Datei darf maximal 10 MB groß sein.' });
      }
      cloudinary.config({
        cloud_name:  env.CLOUDINARY_CLOUD_NAME,
        api_key:     env.CLOUDINARY_API_KEY,
        api_secret:  env.CLOUDINARY_API_SECRET,
      });
      try {
        const buffer  = Buffer.from(await file.arrayBuffer());
        const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
        const result  = await cloudinary.uploader.upload(dataUri, {
          folder:        `products/${id}`,
          resource_type: 'image',
        });
        url = result.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return fail(500, { imageError: 'Bildupload fehlgeschlagen. Bitte prüfe die Cloudinary-Zugangsdaten.' });
      }
    }

    if (!url) return fail(400, { imageError: 'Bitte eine Datei hochladen oder eine URL eingeben.' });

    await db.insert(productImages).values({
      product_id: id,
      url,
      alt,
      sort_order: isNaN(sort_order) ? 0 : sort_order,
    });
  },

  deleteImage: async ({ request }) => {
    const data    = await request.formData();
    const imageId = parseInt(data.get('imageId')?.toString() ?? '');

    if (!imageId) return fail(400, { error: 'Ungültige Bild-ID' });

    const db = getDb(env.DATABASE_URL);
    const [img] = await db.select().from(productImages).where(eq(productImages.id, imageId));

    await db.delete(productImages).where(eq(productImages.id, imageId));

    if (img?.url?.includes('res.cloudinary.com')) {
      try {
        cloudinary.config({
          cloud_name:  env.CLOUDINARY_CLOUD_NAME,
          api_key:     env.CLOUDINARY_API_KEY,
          api_secret:  env.CLOUDINARY_API_SECRET,
        });
        const match = img.url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        if (match) await cloudinary.uploader.destroy(match[1]);
      } catch {}
    }
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
