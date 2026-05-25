import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { products, productImages } from '$lib/server/schema.js';
import { env } from '$env/dynamic/private';
import { cloudinary, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '$lib/server/cloudinary.js';
import { parseProductForm } from '$lib/server/parseProductForm.js';

export const actions = {
  default: async ({ request }) => {
    const data   = await request.formData();
    const parsed = parseProductForm(data);

    if (parsed.errors.length > 0) {
      return fail(400, { error: parsed.errors[0], values: parsed.values });
    }

    const db = getDb(env.DATABASE_URL);
    const [inserted] = await db.insert(products).values({
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
    }).returning({ id: products.id });

    const imageFiles = data.getAll('images').filter(
      f => f instanceof File && f.size > 0
    );

    if (imageFiles.length > 0) {
      const imageErrors = [];
      let sortIdx = 0;

      for (const file of imageFiles) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          imageErrors.push(`"${file.name}": Nur JPEG, PNG, WebP, GIF und AVIF erlaubt.`);
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
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
            public_id:  result.public_id,
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
