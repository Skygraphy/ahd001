export const prerender = false;

import { getDb } from '$lib/server/db.js';
import { products, productImages } from '$lib/server/schema.js';
import { eq, asc, inArray } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { Resend } from 'resend';

export async function load() {
  try {
    const db = getDb(env.DATABASE_URL);

    const rows = await db
      .select()
      .from(products)
      .where(eq(products.visible, true))
      .orderBy(asc(products.sort_order));

    if (rows.length === 0) return { products: [] };

    const ids = rows.map(p => p.id);
    const images = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.product_id, ids))
      .orderBy(asc(productImages.sort_order));

    const imageMap = new Map();
    for (const img of images) {
      if (!imageMap.has(img.product_id)) imageMap.set(img.product_id, []);
      imageMap.get(img.product_id).push(img);
    }

    return { products: rows.map(p => ({ ...p, images: imageMap.get(p.id) ?? [] })) };
  } catch (err) {
    console.error('DB load error:', err);
    return { products: [] };
  }
}

export const actions = {
  contact: async ({ request }) => {
    const data    = await request.formData();
    const name    = data.get('name')?.toString().trim();
    const email   = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!name || name.length === 0) {
      return fail(400, { field: 'name', error: 'Bitte geben Sie Ihren Namen ein.' });
    }
    if (name.length > 100) {
      return fail(400, { field: 'name', error: 'Name darf maximal 100 Zeichen lang sein.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, { field: 'email', error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
    }
    if (email.length > 254) {
      return fail(400, { field: 'email', error: 'E-Mail-Adresse ist zu lang.' });
    }
    if (!message || message.length < 10) {
      return fail(400, { field: 'message', error: 'Bitte schreiben Sie mindestens 10 Zeichen.' });
    }
    if (message.length > 2000) {
      return fail(400, { field: 'message', error: 'Nachricht darf maximal 2000 Zeichen lang sein.' });
    }

    const resend = new Resend(env.RESEND_API_KEY);
    try {
      const { error } = await resend.emails.send({
        from:    'Altholz Design <kontakt@altholz-design.at>',
        to:      env.CONTACT_EMAIL,
        replyTo: email,
        subject: `Neue Anfrage von ${name}`,
        text:    `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
      });

      if (error) {
        console.error('Resend error:', error);
        return fail(500, { error: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.' });
      }
    } catch (err) {
      console.error('Resend network error:', err);
      return fail(500, { error: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.' });
    }

    return { success: true };
  }
};
