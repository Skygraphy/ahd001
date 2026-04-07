export const prerender = false;

import { getDb } from '$lib/server/db.js';
import { products } from '$lib/server/schema.js';
import { eq, asc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { Resend } from 'resend';

export async function load() {
  const db = getDb(env.DATABASE_URL);

  const rows = await db
    .select()
    .from(products)
    .where(eq(products.visible, true))
    .orderBy(asc(products.sort_order));

  return { products: rows };
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
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, { field: 'email', error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
    }
    if (!message || message.length < 10) {
      return fail(400, { field: 'message', error: 'Bitte schreiben Sie mindestens 10 Zeichen.' });
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from:    env.RESEND_FROM ?? 'Altholz Design <onboarding@resend.dev>',
      to:      env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Neue Anfrage von ${name}`,
      text:    `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return fail(500, { error: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.' });
    }

    return { success: true };
  }
};
