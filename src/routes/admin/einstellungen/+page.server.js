import { getDb } from '$lib/server/db.js';
import { settings } from '$lib/server/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

const DEFAULT_TEMPLATE = 'Ich interessiere mich für das Objekt {Name}. Bitte kontaktieren Sie mich unter meiner angegebenen E-Mail-Adresse.';

export async function load() {
  const db = getDb(env.DATABASE_URL);
  const rows = await db.select().from(settings);
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    maintenanceMode:  map.maintenance_mode === 'true',
    inquiryTemplate:  map.inquiry_template ?? DEFAULT_TEMPLATE,
    contactEmail:     map.contact_email ?? 'office@altholz-design.at',
  };
}

export const actions = {
  toggleMaintenance: async ({ request }) => {
    const data     = await request.formData();
    const newValue = data.get('value') === 'true' ? 'true' : 'false';
    const db = getDb(env.DATABASE_URL);
    await db
      .insert(settings)
      .values({ key: 'maintenance_mode', value: newValue })
      .onConflictDoUpdate({ target: settings.key, set: { value: newValue } });
    return { success: true };
  },

  saveContactEmail: async ({ request }) => {
    const data  = await request.formData();
    const value = data.get('email')?.toString().trim() ?? 'office@altholz-design.at';
    const db = getDb(env.DATABASE_URL);
    await db
      .insert(settings)
      .values({ key: 'contact_email', value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
    return { success: true };
  },

  saveTemplate: async ({ request }) => {
    const data  = await request.formData();
    const value = data.get('template')?.toString().trim() ?? DEFAULT_TEMPLATE;
    const db = getDb(env.DATABASE_URL);
    await db
      .insert(settings)
      .values({ key: 'inquiry_template', value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
    return { success: true };
  },
};
