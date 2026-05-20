import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { products, productImages } from '$lib/server/schema.js';
import { env } from '$env/dynamic/private';
import { v2 as cloudinary } from 'cloudinary';

export const actions = {
  default: async ({ request }) => {
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

    if (!nummer)      return fail(400, { error: 'Nummer ist erforderlich.', values: Object.fromEntries(data) });
    if (!name)        return fail(400, { error: 'Name ist erforderlich.', values: Object.fromEntries(data) });
    if (!description) return fail(400, { error: 'Beschreibung ist erforderlich.', values: Object.fromEntries(data) });
    if (!type)        return fail(400, { error: 'Typ ist erforderlich.', values: Object.fromEntries(data) });
    if (isNaN(priceEuros) || priceEuros <= 0) {
      return fail(400, { error: 'Ungültiger Preis.', values: Object.fromEntries(data) });
    }

    const price_cents = Math.round(priceEuros * 100);

    const db = getDb(env.DATABASE_URL);
    const [inserted] = await db.insert(products).values({
      nummer,
      name,
      description,
      beschreibung,
      besonderheiten,
      materialien,
      masse,
      price_cents,
      type,
      sort_order: isNaN(sort_order) ? 0 : sort_order,
      visible,
    }).returning({ id: products.id });

    const imageFiles = data.getAll('images').filter(
      f => f instanceof File && f.size > 0
    );

    if (imageFiles.length > 0) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
      cloudinary.config({
        cloud_name:  env.CLOUDINARY_CLOUD_NAME,
        api_key:     env.CLOUDINARY_API_KEY,
        api_secret:  env.CLOUDINARY_API_SECRET,
      });

      const imageErrors = [];
      let sortIdx = 0;

      for (const file of imageFiles) {
        if (!allowed.includes(file.type)) {
          imageErrors.push(`"${file.name}": Nur JPEG, PNG, WebP, GIF und AVIF erlaubt.`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          imageErrors.push(`"${file.name}": Datei darf maximal 10 MB groß sein.`);
          continue;
        }
        try {
          const buffer  = Buffer.from(await file.arrayBuffer());
          const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
          const result  = await cloudinary.uploader.upload(dataUri, {
            folder:        `products/${inserted.id}`,
            resource_type: 'image',
          });
          await db.insert(productImages).values({
            product_id: inserted.id,
            url:        result.secure_url,
            alt:        '',
            sort_order: sortIdx++,
          });
        } catch (err) {
          console.error('Cloudinary upload error:', err);
          imageErrors.push(`"${file.name}": Upload fehlgeschlagen.`);
        }
      }

      if (imageErrors.length > 0) {
        redirect(303, `/admin/produkte/${inserted.id}?uploadErrors=${encodeURIComponent(imageErrors.join('|'))}`);
      }
    }

    redirect(303, `/admin/produkte/${inserted.id}`);
  },
};
