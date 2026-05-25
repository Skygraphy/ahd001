import { fail, redirect, error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { products, productImages } from '$lib/server/schema.js';
import { eq, asc, desc, and } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { cloudinary, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '$lib/server/cloudinary.js';
import { parseProductForm } from '$lib/server/parseProductForm.js';

export async function load({ params, url }) {
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

  const uploadErrors = url.searchParams.get('uploadErrors');

  return {
    product,
    images,
    uploadErrors: uploadErrors ? uploadErrors.split('|') : null,
  };
}

export const actions = {
  update: async ({ request, params }) => {
    const id = parseInt(params.id, 10);
    if (!id || isNaN(id)) return fail(400, { error: 'Ungültige Produkt-ID' });
    const data = await request.formData();
    const parsed = parseProductForm(data);

    if (parsed.errors.length > 0) {
      return fail(400, { error: parsed.errors[0] });
    }

    const db = getDb(env.DATABASE_URL);
    await db.update(products).set({
      nummer:          parsed.nummer,
      name:            parsed.name,
      description:     parsed.description,
      beschreibung:    parsed.beschreibung,
      besonderheiten:  parsed.besonderheiten,
      materialien:     parsed.materialien,
      masse:           parsed.masse,
      price_cents:     parsed.price_cents,
      type:            parsed.type,
      sort_order:      parsed.sort_order,
      visible:         parsed.visible,
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

    let public_id = null;

    if (file instanceof File && file.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return fail(400, { imageError: 'Nur JPEG, PNG, WebP, GIF und AVIF sind erlaubt.' });
      }
      if (file.size > MAX_IMAGE_BYTES) {
        return fail(400, { imageError: 'Datei darf maximal 10 MB groß sein.' });
      }
      try {
        const buffer  = Buffer.from(await file.arrayBuffer());
        const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
        const result  = await cloudinary.uploader.upload(dataUri, {
          folder:        `products/${id}`,
          resource_type: 'image',
        });
        url       = result.secure_url;
        public_id = result.public_id;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return fail(500, { imageError: 'Bildupload fehlgeschlagen. Bitte prüfe die Cloudinary-Zugangsdaten.' });
      }
    } else if (url) {
      // Validate external URL: only http(s) allowed
      let parsed;
      try { parsed = new URL(url); } catch {
        return fail(400, { imageError: 'Ungültige URL.' });
      }
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return fail(400, { imageError: 'Nur http(s)-URLs sind erlaubt.' });
      }
    }

    if (!url) return fail(400, { imageError: 'Bitte eine Datei hochladen oder eine URL eingeben.' });

    await db.insert(productImages).values({
      product_id: id,
      url,
      alt,
      sort_order,
      public_id,
    });
  },

  deleteImage: async ({ request }) => {
    const data    = await request.formData();
    const imageId = parseInt(data.get('imageId')?.toString() ?? '', 10);

    if (!imageId || isNaN(imageId)) return fail(400, { error: 'Ungültige Bild-ID' });

    const db = getDb(env.DATABASE_URL);
    const [img] = await db.select().from(productImages).where(eq(productImages.id, imageId));

    await db.delete(productImages).where(eq(productImages.id, imageId));

    if (img?.url?.includes('res.cloudinary.com')) {
      try {
        // Prefer stored public_id; fall back to URL extraction for older images
        const pid = img.public_id ?? extractPublicId(img.url);
        if (pid) await cloudinary.uploader.destroy(pid);
      } catch (err) {
        console.error('Cloudinary destroy error:', err);
      }
    }
  },

  reorderImages: async ({ request, params }) => {
    const productId = parseInt(params.id, 10);
    if (!productId || isNaN(productId)) return fail(400, { error: 'Ungültige Produkt-ID' });
    const data = await request.formData();
    const ids = data.getAll('ids')
      .map(v => parseInt(String(v), 10))
      .filter(n => Number.isFinite(n) && n > 0);

    if (ids.length === 0) return fail(400, { error: 'Keine gültigen Bild-IDs' });

    const db = getDb(env.DATABASE_URL);
    try {
      await Promise.all(
        ids.map((imgId, idx) =>
          db.update(productImages)
            .set({ sort_order: idx })
            .where(and(eq(productImages.id, imgId), eq(productImages.product_id, productId)))
        )
      );
    } catch (err) {
      console.error('Reorder error:', err);
      return fail(500, { error: 'Reihenfolge konnte nicht gespeichert werden.' });
    }
  },

  deleteProduct: async ({ params }) => {
    const id = parseInt(params.id, 10);
    if (!id || isNaN(id)) return fail(400, { error: 'Ungültige Produkt-ID' });
    const db = getDb(env.DATABASE_URL);

    const images = await db
      .select({ url: productImages.url, public_id: productImages.public_id })
      .from(productImages)
      .where(eq(productImages.product_id, id));

    const cloudinaryImages = images.filter(img => img.url?.includes('res.cloudinary.com'));
    if (cloudinaryImages.length > 0) {
      try {
        await Promise.all(
          cloudinaryImages.map(img => {
            const pid = img.public_id ?? extractPublicId(img.url);
            return pid ? cloudinary.uploader.destroy(pid) : Promise.resolve();
          })
        );
      } catch (err) {
        console.error('Cloudinary cleanup error:', err);
      }
    }

    await db.delete(products).where(eq(products.id, id));
    redirect(303, '/admin');
  },
};

function extractPublicId(url) {
  // Extracts Cloudinary public_id from a secure_url, handles query strings and versioning
  const match = url.match(/\/upload\/(?:v\d+\/)?([^?]+?)(?:\.[a-z0-9]+)?(?:\?.*)?$/i);
  return match?.[1] ?? null;
}
